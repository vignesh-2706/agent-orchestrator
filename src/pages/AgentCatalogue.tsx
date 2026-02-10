import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CategoryCard from "@/components/CategoryCard";
import ScenarioList from "@/components/ScenarioList";
import AgenticOverview from "@/components/AgenticOverview";
import { categories, type CategoryType, type Scenario } from "@/data/catalogueData";
import { ArrowLeft } from "lucide-react";

type View = "categories" | "scenarios" | "overview";

const AgentCatalogue = () => {
  const [view, setView] = useState<View>("categories");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const handleCategoryClick = useCallback((categoryId: CategoryType) => {
    setSelectedCategory(categoryId);
    setSelectedScenario(null);
    setView("scenarios");
  }, []);

  const handleScenarioClick = useCallback((scenario: Scenario) => {
    setSelectedScenario(scenario);
    setView("overview");
  }, []);

  const handleBack = useCallback(() => {
    if (view === "overview") {
      setSelectedScenario(null);
      setView("scenarios");
    } else if (view === "scenarios") {
      setSelectedCategory(null);
      setView("categories");
    }
  }, [view]);

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <AnimatePresence>
            {view !== "categories" && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
          <h1 className="text-2xl font-bold text-foreground">Agent Catalogues</h1>
        </div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          {view === "categories" && (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card border rounded-2xl p-10 shadow-sm"
            >
              <div className="flex flex-wrap justify-center gap-8">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat.id}
                    label={cat.label}
                    isSelected={selectedCategory === cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {view === "scenarios" && currentCategory && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card border rounded-2xl p-10 shadow-sm"
            >
              <div className="flex items-center justify-center gap-12 flex-wrap">
                <CategoryCard
                  category={currentCategory.id}
                  label={currentCategory.label}
                  isSelected
                  onClick={() => {}}
                />
                <ScenarioList
                  scenarios={currentCategory.scenarios}
                  onScenarioClick={handleScenarioClick}
                />
              </div>
            </motion.div>
          )}

          {view === "overview" && selectedScenario && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AgenticOverview scenario={selectedScenario} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AgentCatalogue;
