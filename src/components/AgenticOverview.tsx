import { motion } from "framer-motion";
import { Eye, Play, ArrowDown, CheckCircle2, Circle } from "lucide-react";
import type { Scenario, CategoryType } from "@/data/catalogueData";
import { categoryLabel, defaultPlaybook, agenticFlowSteps } from "@/data/catalogueData";
import { useNavigate } from "react-router-dom";

interface AgenticOverviewProps {
  scenario: Scenario;
}

const badgeClass: Record<CategoryType, string> = {
  monitoring: "category-monitoring",
  security: "category-security",
  build: "category-build",
};

const AgenticOverview = ({ scenario }: AgenticOverviewProps) => {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate("/executions", { state: { autoRun: true, scenarioName: scenario.name, category: scenario.category } });
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
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Eye className="w-5 h-5 text-muted-foreground" />
          </button>
          <button onClick={handlePlay} className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
            <Play className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Content: flow + playbook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agentic Flow - sequential steps */}
        <div className="lg:col-span-2 bg-card border rounded-lg p-6 shadow-sm">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Agentic Flow</h4>

          <div className="flex flex-col items-center gap-1">
            {agenticFlowSteps.map((step, i) => (
              <motion.div key={step.id} className="w-full max-w-md flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="w-full border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                    <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                  </div>
                </motion.div>
                {i < agenticFlowSteps.length - 1 && (
                  <ArrowDown className="w-4 h-4 text-muted-foreground/40 my-1" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Playbook - tools listing */}
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
