import { motion, AnimatePresence } from "framer-motion";
import { Eye, Copy, Play, Pencil, Plus } from "lucide-react";
import type { Scenario } from "@/data/catalogueData";
import { toast } from "sonner";

interface ScenarioListProps {
  scenarios: Scenario[];
  onScenarioClick: (scenario: Scenario) => void;
}

const ScenarioList = ({ scenarios, onScenarioClick }: ScenarioListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-card rounded-xl border shadow-lg overflow-hidden min-w-[380px]"
    >
      <div className="px-5 py-3 border-b bg-secondary/50">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Scenarios
        </h3>
      </div>

      <div className="divide-y">
        <AnimatePresence>
          {scenarios.map((scenario, i) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.25 }}
              className="flex items-center justify-between px-5 py-4 hover:bg-accent/50 cursor-pointer transition-colors group"
              onClick={() => onScenarioClick(scenario)}
            >
              <div>
                <p className="font-medium text-foreground">{scenario.name}</p>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </div>
              <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toast.success("Copied!"); }}
                  className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toast.info("Running scenario..."); }}
                  className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                  title="Play"
                >
                  <Play className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center py-3 border-t">
        <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default ScenarioList;
