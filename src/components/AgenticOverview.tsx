import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Send, Bot, User } from "lucide-react";
import type { Scenario, CategoryType } from "@/data/catalogueData";
import { categoryLabel, agenticFlowSteps } from "@/data/catalogueData";
import { useNavigate } from "react-router-dom";
import { defaultPlaybook } from "@/data/catalogueData";

interface AgenticOverviewProps {
  scenario: Scenario;
}

const badgeClass: Record<CategoryType, string> = {
  monitoring: "category-monitoring",
  security: "category-security",
  build: "category-build",
};

const buildPrompt = (scenario: Scenario) => {
  const steps = agenticFlowSteps.map((s, i) => `${i + 1}. ${s.title} – ${s.description}`).join("\n");
  return `Run the "${scenario.name}" workflow:\n\n${steps}\n\nPlease execute these steps sequentially, pausing at Remediation for my approval.`;
};

const AgenticOverview = ({ scenario }: AgenticOverviewProps) => {
  const navigate = useNavigate();
  const prompt = buildPrompt(scenario);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<{ role: "agent" | "user"; text: string }[]>([
    { role: "agent", text: `Workflow "${scenario.name}" is ready. Click Play or type a command to begin execution.` },
    { role: "user", text: prompt },
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePlay = () => {
    navigate("/executions", {
      state: { autoRun: true, scenarioName: scenario.name, category: scenario.category, prompt },
    });
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    // If user types something other than play-related, just echo
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Click the Play button to start this workflow in the Executions page." },
      ]);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      {/* Scenario header */}
      <div className="flex items-center gap-4 mb-6 bg-card border rounded-lg p-4 shadow-sm">
        <span className={`${badgeClass[scenario.category]} w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold`}>
          {categoryLabel[scenario.category]}
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{scenario.name}</h3>
          <p className="text-sm text-muted-foreground">{scenario.description}</p>
        </div>
        <button
          onClick={handlePlay}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <Play className="w-4 h-4" />
          Run
        </button>
      </div>

      {/* Content: chat + playbook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat interface */}
        <div className="lg:col-span-2 bg-card border rounded-lg shadow-sm flex flex-col min-h-[420px]">
          <div className="px-4 py-3 border-b">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Agent Chat</h4>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[400px] bg-secondary/10">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "agent" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {msg.role === "agent" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <div className={`px-3 py-2 rounded-lg max-w-[85%] text-sm whitespace-pre-line ${
                  msg.role === "agent"
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground"
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t bg-card">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
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

        {/* Playbook */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border rounded-lg p-6 shadow-sm"
        >
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 text-center border-b pb-3">
            Playbook – Tools
          </h4>
          <div className="space-y-5">
            {defaultPlaybook.map((section) => (
              <div key={section.title}>
                <h5 className="font-semibold text-foreground text-sm mb-2">{section.title}</h5>
                <div className="flex flex-wrap gap-1.5">
                  {section.items.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-accent text-accent-foreground text-xs font-medium border border-border/50"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AgenticOverview;
