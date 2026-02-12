import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Pause, Play } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  runningExecutions,
  archivedExecutions,
  categoryLabel,
  type Execution,
  type CategoryType,
} from "@/data/catalogueData";
import ExecutionFlow from "@/components/ExecutionFlow";

const statusRowClass: Record<string, string> = {
  running: "status-running text-white",
  waiting: "status-waiting text-white",
  completed: "status-completed text-white",
  failed: "status-failed text-white",
};

const AgentExecutions = () => {
  const location = useLocation();
  const autoRunState = location.state as { autoRun?: boolean; scenarioName?: string; category?: CategoryType; prompt?: string } | null;

  const [tab, setTab] = useState<"running" | "archive">("running");
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(
    autoRunState?.autoRun ? { id: "auto", name: autoRunState.scenarioName || "Workflow", category: autoRunState.category || "monitoring", status: "running", startTime: new Date().toLocaleTimeString() } : null
  );

  const executions = tab === "running" ? runningExecutions : archivedExecutions;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">Agent Executions</h1>

        <div className="flex gap-6">
          {/* Left: execution list */}
          <motion.div
            layout
            className={`bg-card border rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
              selectedExecution ? "w-[340px] flex-shrink-0" : "w-full"
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
              {Array.from({ length: Math.max(0, 5 - executions.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16" />
              ))}
            </div>
          </motion.div>

          {/* Right: execution flow panel */}
          <AnimatePresence>
            {selectedExecution && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.35 }}
                className="flex-1 bg-card border rounded-lg shadow-sm p-5 flex flex-col min-h-[600px]"
              >
                <ExecutionFlow
                  autoRun={autoRunState?.autoRun}
                  scenarioName={selectedExecution.name}
                  prompt={autoRunState?.prompt}
                />
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

      {isArchive && (
        <span className="text-xs font-medium opacity-80 capitalize">{execution.status}</span>
      )}

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
