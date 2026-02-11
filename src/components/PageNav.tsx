import { NavLink } from "react-router-dom";
import { BookOpen, Zap } from "lucide-react";

const PageNav = () => {
  return (
    <nav className="sap-shell border-b border-[hsl(var(--sap-shell))]/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center h-12 gap-8">
        <span className="text-sm font-bold tracking-tight text-white/90">Agentic Workflows</span>
        <div className="flex gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            Catalogues
          </NavLink>
          <NavLink
            to="/executions"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
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
