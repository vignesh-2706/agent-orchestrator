import { NavLink } from "react-router-dom";
import { BookOpen, Zap } from "lucide-react";

const PageNav = () => {
  return (
    <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center h-14 gap-8">
        <span className="text-lg font-bold text-primary tracking-tight">Agentic Workflows</span>
        <div className="flex gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            Catalogues
          </NavLink>
          <NavLink
            to="/executions"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`
            }
          >
            <Zap className="w-4 h-4" />
            Executions
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default PageNav;
