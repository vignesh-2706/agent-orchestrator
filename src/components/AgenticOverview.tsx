import { motion } from "framer-motion";
import { Eye, Play, Plus } from "lucide-react";
import type { Scenario, PlaybookSection, CategoryType } from "@/data/catalogueData";
import { categoryLabel, defaultPlaybook } from "@/data/catalogueData";

interface AgenticOverviewProps {
  scenario: Scenario;
}

const badgeClass: Record<CategoryType, string> = {
  monitoring: "category-monitoring",
  security: "category-security",
  build: "category-build",
};

const AgenticOverview = ({ scenario }: AgenticOverviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      {/* Scenario header */}
      <div className="flex items-center gap-4 mb-6 bg-card border rounded-xl p-4 shadow-sm">
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
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Play className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content: flow + playbook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agentic Flow */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-8 shadow-sm">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">Agentic Overview</h4>

          <div className="flex flex-col items-center">
            {/* AI Model node */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="border-2 border-primary/30 rounded-xl px-8 py-4 bg-accent/50 font-semibold text-foreground"
            >
              Agentic AI Model
            </motion.div>

            {/* Connector lines */}
            <div className="w-px h-8 bg-border" />
            <div className="flex items-start gap-0">
              <div className="flex flex-col items-center">
                <div className="w-24 h-px bg-border" />
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex flex-col items-center">
                <div className="w-24 h-px bg-border" />
              </div>
            </div>

            {/* Three child nodes */}
            <div className="flex gap-8 mt-2">
              {["Tool", "Memory", "Model"].map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.1 }}
                  className="border rounded-xl px-6 py-4 bg-card shadow-sm font-medium text-muted-foreground min-w-[100px] text-center"
                >
                  {label}
                </motion.div>
              ))}
            </div>

            {/* Visual connector from AI Model to children */}
            <svg className="absolute pointer-events-none" style={{ display: "none" }}>
              {/* Hidden - using div-based connectors above */}
            </svg>
          </div>
        </div>

        {/* Playbook */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border rounded-xl p-6 shadow-sm"
        >
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 text-center border-b pb-3">
            Playbook
          </h4>

          <div className="space-y-5">
            {defaultPlaybook.map((section) => (
              <PlaybookSectionCard key={section.title} section={section} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const PlaybookSectionCard = ({ section }: { section: PlaybookSection }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <h5 className="font-semibold text-foreground">{section.title}</h5>
      <button className="p-1 rounded-md hover:bg-secondary transition-colors">
        <Plus className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
    <div className="border-t pt-2">
      {section.items.map((item) => (
        <p key={item} className="text-sm text-muted-foreground py-0.5 pl-2">
          - {item}
        </p>
      ))}
    </div>
  </div>
);

export default AgenticOverview;
