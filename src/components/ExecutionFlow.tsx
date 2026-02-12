import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { agenticFlowSteps } from "@/data/catalogueData";

interface ExecutionFlowProps {
  autoRun?: boolean;
  scenarioName?: string;
  prompt?: string;
}

const STEP_DURATION = 10000;

const ExecutionFlow = ({ autoRun, scenarioName, prompt }: ExecutionFlowProps) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [waitingForInput, setWaitingForInput] = useState(!autoRun);
  const [isStarted, setIsStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "agent" | "user"; text: string; loading?: boolean }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with prompt if provided
  useEffect(() => {
    const initial: { role: "agent" | "user"; text: string }[] = [];
    if (prompt) {
      initial.push({ role: "user", text: prompt });
      initial.push({ role: "agent", text: "Workflow received. Type 'trigger' to start execution." });
    } else {
      initial.push({ role: "agent", text: "Workflow ready. Please type 'trigger' to start execution." });
    }
    setChatMessages(initial);
  }, [prompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Run steps as chat messages
  useEffect(() => {
    if (currentStep < 0 || currentStep >= agenticFlowSteps.length) return;
    if (waitingForInput) return;

    const step = agenticFlowSteps[currentStep];

    // Show "running" message
    setChatMessages((prev) => [
      ...prev,
      { role: "agent", text: `⏳ Running: ${step.title}...`, loading: true },
    ]);

    const timer = setTimeout(() => {
      // Remove loading message, add completed
      setChatMessages((prev) => {
        const filtered = prev.filter((m) => !m.loading);

        // Step 3 (Remediation, index 3) → human-in-the-loop
        if (currentStep === 3) {
          return [
            ...filtered,
            { role: "agent", text: `⚠️ Step "${step.title}" requires your approval before proceeding.\nPlease type 'approve' to continue.` },
          ];
        }

        return [
          ...filtered,
          { role: "agent", text: `✅ ${step.title} — completed successfully.` },
        ];
      });

      if (currentStep === 3) {
        setWaitingForInput(true);
        return;
      }

      // Move to next step
      if (currentStep + 1 < agenticFlowSteps.length) {
        setTimeout(() => setCurrentStep((s) => s + 1), 600);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "agent", text: "🎉 All steps completed. Workflow execution finished successfully." },
        ]);
      }
    }, STEP_DURATION);

    return () => clearTimeout(timer);
  }, [currentStep, waitingForInput]);

  const handleSend = useCallback(() => {
    if (!chatInput.trim()) return;
    const input = chatInput.trim().toLowerCase();
    setChatMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");

    if (!isStarted && input === "trigger") {
      setIsStarted(true);
      setWaitingForInput(false);
      setCurrentStep(0);
      setChatMessages((prev) => [
        ...prev,
        { role: "agent", text: "✔ Trigger received. Starting execution..." },
      ]);
      return;
    }

    if (waitingForInput && input === "approve" && currentStep >= 0) {
      setWaitingForInput(false);
      setChatMessages((prev) => [
        ...prev,
        { role: "agent", text: `✅ ${agenticFlowSteps[currentStep].title} — approved and completed.` },
      ]);
      if (currentStep + 1 < agenticFlowSteps.length) {
        setTimeout(() => setCurrentStep((s) => s + 1), 600);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "agent", text: "🎉 All steps completed. Workflow execution finished successfully." },
        ]);
      }
      return;
    }

    setChatMessages((prev) => [
      ...prev,
      { role: "agent", text: !isStarted ? "Please type 'trigger' to start." : "Please type 'approve' to proceed." },
    ]);
  }, [chatInput, isStarted, waitingForInput, currentStep]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-base font-semibold mb-3 text-center">
        {scenarioName ? `${scenarioName} – Execution` : "Execution Flow"}
      </h3>

      {/* Chat-only interface */}
      <div className="flex flex-col flex-1 border rounded-lg overflow-hidden">
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-secondary/10">
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "agent" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {msg.role === "agent" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>
              <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm whitespace-pre-line ${
                msg.role === "agent"
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary text-primary-foreground"
              }`}>
                <span>{msg.text}</span>
                {msg.loading && <Loader2 className="inline-block w-3 h-3 ml-1.5 animate-spin" />}
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="flex items-center gap-2 p-3 border-t bg-card">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={!isStarted ? "Type 'trigger' to start..." : waitingForInput ? "Type 'approve' to continue..." : "Type a message..."}
            className="flex-1 bg-secondary/50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 ring-primary/30 transition-shadow"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionFlow;
