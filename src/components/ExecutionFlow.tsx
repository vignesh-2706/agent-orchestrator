import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Loader2, ArrowDown, Send, User, Bot, AlertTriangle } from "lucide-react";
import { agenticFlowSteps, type FlowStep } from "@/data/catalogueData";

type StepStatus = "pending" | "waiting_input" | "running" | "completed" | "failed";

interface ExecutionFlowProps {
  autoRun?: boolean;
  scenarioName?: string;
}

const STEP_DURATION = 10000; // 10 seconds per step

const ExecutionFlow = ({ autoRun, scenarioName }: ExecutionFlowProps) => {
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    agenticFlowSteps.map(() => "pending")
  );
  const [currentStep, setCurrentStep] = useState(-1);
  const [waitingForInput, setWaitingForInput] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ role: "agent" | "user"; text: string }[]>([
    { role: "agent", text: "Workflow ready. Please type 'trigger' to start execution." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  // Run step with timer
  useEffect(() => {
    if (currentStep < 0 || currentStep >= agenticFlowSteps.length) return;
    if (stepStatuses[currentStep] !== "running") return;

    const timer = setTimeout(() => {
      // Step 3 (Remediation, index 3) triggers human-in-the-loop
      if (currentStep === 3) {
        setStepStatuses((prev) => {
          const next = [...prev];
          next[currentStep] = "waiting_input";
          return next;
        });
        setWaitingForInput(true);
        setChatMessages((prev) => [
          ...prev,
          { role: "agent", text: `Step "${agenticFlowSteps[currentStep].title}" requires approval. Please confirm to proceed (type 'approve').` },
        ]);
        return;
      }

      // Complete current step and move to next
      setStepStatuses((prev) => {
        const next = [...prev];
        next[currentStep] = "completed";
        return next;
      });
      setChatMessages((prev) => [
        ...prev,
        { role: "agent", text: `✓ Step "${agenticFlowSteps[currentStep].title}" completed successfully.` },
      ]);

      if (currentStep + 1 < agenticFlowSteps.length) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setStepStatuses((prev) => {
            const next = [...prev];
            next[currentStep + 1] = "running";
            return next;
          });
        }, 500);
      }
    }, STEP_DURATION);

    return () => clearTimeout(timer);
  }, [currentStep, stepStatuses]);

  const handleSend = useCallback(() => {
    if (!chatInput.trim()) return;
    const input = chatInput.trim().toLowerCase();
    setChatMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");

    if (!isStarted && input === "trigger") {
      setIsStarted(true);
      setWaitingForInput(false);
      setCurrentStep(0);
      setStepStatuses((prev) => {
        const next = [...prev];
        next[0] = "running";
        return next;
      });
      setChatMessages((prev) => [
        ...prev,
        { role: "agent", text: "Execution started. Running Step 1..." },
      ]);
      return;
    }

    if (waitingForInput && input === "approve" && currentStep >= 0) {
      setWaitingForInput(false);
      setStepStatuses((prev) => {
        const next = [...prev];
        next[currentStep] = "completed";
        return next;
      });
      setChatMessages((prev) => [
        ...prev,
        { role: "agent", text: `✓ Approved. Step "${agenticFlowSteps[currentStep].title}" completed. Moving to next step...` },
      ]);

      if (currentStep + 1 < agenticFlowSteps.length) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setStepStatuses((prev) => {
            const next = [...prev];
            next[currentStep + 1] = "running";
            return next;
          });
        }, 500);
      }
      return;
    }

    setChatMessages((prev) => [
      ...prev,
      { role: "agent", text: !isStarted ? "Please type 'trigger' to start." : "Please type 'approve' to proceed." },
    ]);
  }, [chatInput, isStarted, waitingForInput, currentStep]);

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-[hsl(var(--sap-positive))]" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "waiting_input":
        return <AlertTriangle className="w-5 h-5 text-[hsl(var(--sap-critical))]" />;
      case "failed":
        return <Circle className="w-5 h-5 text-destructive" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground/30" />;
    }
  };

  const getStepBorder = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return "border-[hsl(var(--sap-positive))]/50 bg-[hsl(var(--sap-positive))]/5";
      case "running":
        return "border-primary/50 bg-primary/5 shadow-md";
      case "waiting_input":
        return "border-[hsl(var(--sap-critical))]/50 bg-[hsl(var(--sap-critical))]/5";
      default:
        return "border-border";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-base font-semibold mb-4 text-center">
        {scenarioName ? `${scenarioName} – Execution` : "Execution Flow"}
      </h3>

      {/* Flow steps */}
      <div className="flex flex-col items-center gap-1 mb-4 overflow-y-auto flex-1 pr-1">
        {agenticFlowSteps.map((step, i) => (
          <div key={step.id} className="w-full flex flex-col items-center">
            <motion.div
              animate={{
                scale: stepStatuses[i] === "running" ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`w-full border rounded-lg p-3 transition-all duration-500 ${getStepBorder(stepStatuses[i])}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{getStepIcon(stepStatuses[i])}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                </div>
                {stepStatuses[i] === "running" && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: STEP_DURATION / 1000, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </div>
              {/* Progress bar for running step */}
              {stepStatuses[i] === "running" && (
                <div className="mt-2 w-full bg-muted rounded-full h-1 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: STEP_DURATION / 1000, ease: "linear" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              )}
            </motion.div>
            {i < agenticFlowSteps.length - 1 && (
              <ArrowDown className={`w-3 h-3 my-0.5 ${stepStatuses[i] === "completed" ? "text-[hsl(var(--sap-positive))]" : "text-muted-foreground/30"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Chat section */}
      <div className="flex flex-col border rounded-lg overflow-hidden mt-auto">
        <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-[200px] bg-secondary/20">
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2 text-sm ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "agent" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {msg.role === "agent" ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
              </div>
              <div className={`px-3 py-1.5 rounded-lg max-w-[80%] ${
                msg.role === "agent"
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary text-primary-foreground"
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2 p-2 border-t bg-card">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={!isStarted ? "Type 'trigger' to start..." : "Type your response..."}
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
