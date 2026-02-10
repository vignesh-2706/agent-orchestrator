import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Pause, Play, Send } from "lucide-react";
import {
  runningExecutions,
  archivedExecutions,
  categoryLabel,
  type Execution,
  type CategoryType,
} from "@/data/catalogueData";

const statusRowClass: Record<string, string> = {
  running: "status-running text-white",
  waiting: "status-waiting text-white",
  completed: "status-completed text-white",
  failed: "status-failed text-white",
};

const AgentExecutions = () => {
  const [tab, setTab] = useState<"running" | "archive">("running");
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: "agent" | "user"; text: string }[]>([
    { role: "agent", text: "Workflow started. Waiting for approval to proceed with the next step." },
  ]);
  const [chatInput, setChatInput] = useState("");

  const executions = tab === "running" ? runningExecutions : archivedExecutions;

  const handleSend = useCallback(() => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: chatInput },
      { role: "agent", text: "Processing your input... Continuing workflow." },
    ]);
    setChatInput("");
  }, [chatInput]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">Agent Executions</h1>

        <div className={`flex gap-6 transition-all duration-300 ${selectedExecution ? "" : ""}`}>
          {/* Left: execution list */}
          <motion.div
            layout
            className={`bg-card border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${
              selectedExecution ? "w-[360px] flex-shrink-0" : "w-full"
            }`}
          >
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => { setTab("running"); setSelectedExecution(null); }}
                className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
                  tab === "running"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Running
              </button>
              <button
                onClick={() => { setTab("archive"); setSelectedExecution(null); }}
                className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
                  tab === "archive"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Archive
              </button>
            </div>

            {/* List */}
            <div className="divide-y">
              <AnimatePresence>
                {executions.map((exec, i) => (
                  <ExecutionRow
                    key={exec.id}
                    execution={exec}
                    index={i}
                    isSelected={selectedExecution?.id === exec.id}
                    isArchive={tab === "archive"}
                    onClick={() => setSelectedExecution(exec)}
                  />
                ))}
              </AnimatePresence>
              {/* Empty rows for visual consistency */}
              {Array.from({ length: Math.max(0, 5 - executions.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16" />
              ))}
            </div>
          </motion.div>

          {/* Right: agent detail panel */}
          <AnimatePresence>
            {selectedExecution && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.35 }}
                className="flex-1 bg-card border rounded-2xl shadow-sm p-6 flex flex-col"
              >
                <h3 className="text-lg font-semibold mb-4 text-center">
                  {selectedExecution.name} Agent
                </h3>

                {/* Mini agent flow */}
                <div className="flex flex-col items-center mb-6">
                  <div className="border rounded-xl px-6 py-3 bg-accent/50 font-medium text-sm">
                    Agentic AI Model
                  </div>
                  <div className="w-px h-5 bg-border" />
                  <div className="flex gap-4">
                    {["Tool", "Memory", "Model"].map((label) => (
                      <div
                        key={label}
                        className="border rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground bg-card"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat section */}
                <div className="flex-1 flex flex-col border rounded-xl overflow-hidden">
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[280px] bg-secondary/30">
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${
                          msg.role === "agent"
                            ? "bg-accent text-accent-foreground"
                            : "bg-primary text-primary-foreground ml-auto"
                        }`}
                      >
                        <span className="font-medium text-xs block mb-0.5 opacity-70">
                          {msg.role === "agent" ? "Q:" : "Response:"}
                        </span>
                        {msg.text}
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 p-3 border-t bg-card">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type your response..."
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface ExecutionRowProps {
  execution: Execution;
  index: number;
  isSelected: boolean;
  isArchive: boolean;
  onClick: () => void;
}

const ExecutionRow = ({ execution, index, isSelected, isArchive, onClick }: ExecutionRowProps) => {
  const badgeClass: Record<CategoryType, string> = {
    monitoring: "category-monitoring",
    security: "category-security",
    build: "category-build",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
        isSelected ? "bg-accent/60" : "hover:bg-accent/30"
      } ${statusRowClass[execution.status]} bg-opacity-90`}
    >
      <span className={`${badgeClass[execution.category]} w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0`}>
        {categoryLabel[execution.category]}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{execution.name}</p>
        <p className="text-xs opacity-80">
          {isArchive
            ? `${execution.startTime || ""} → ${execution.endTime || ""}`
            : execution.status === "running"
            ? `Started: ${execution.startTime}`
            : `Expected: ${execution.expectedTime}`}
        </p>
      </div>

      {isArchive ? (
        <span className="text-xs font-medium opacity-80 capitalize">{execution.status}</span>
      ) : null}

      <div className="flex items-center gap-1">
        <button className="p-1 rounded hover:bg-white/20 transition-colors" onClick={(e) => e.stopPropagation()}>
          <Eye className="w-4 h-4" />
        </button>
        {!isArchive && (
          <button className="p-1 rounded hover:bg-white/20 transition-colors" onClick={(e) => e.stopPropagation()}>
            {execution.status === "running" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AgentExecutions;
