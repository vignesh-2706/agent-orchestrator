import { motion } from "framer-motion";
import { Shield, Activity, Hammer } from "lucide-react";
import type { CategoryType } from "@/data/catalogueData";

interface CategoryCardProps {
  category: CategoryType;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const icons: Record<CategoryType, React.ReactNode> = {
  monitoring: <Activity className="w-8 h-8" />,
  security: <Shield className="w-8 h-8" />,
  build: <Hammer className="w-8 h-8" />,
};

const CategoryCard = ({ category, label, isSelected, onClick }: CategoryCardProps) => {
  return (
    <motion.button
      layout
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`category-${category} rounded-xl px-8 py-10 flex flex-col items-center justify-center gap-3 shadow-lg cursor-pointer transition-shadow hover:shadow-xl min-w-[180px] ${
        isSelected ? "ring-2 ring-offset-2 ring-foreground/20" : ""
      }`}
    >
      {icons[category]}
      <span className="text-lg font-semibold tracking-wide">{label}</span>
    </motion.button>
  );
};

export default CategoryCard;
