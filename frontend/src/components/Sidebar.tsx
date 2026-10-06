import {
  LayoutDashboard,
  Building2,
  Landmark,
  Tag,
  ArrowLeftRight,
  FileInput,
  RotateCcw,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export type Tab =
  | "overview"
  | "account"
  | "category"
  | "transaction"
  | "company"
  | "cnab"
  | "notify";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Home", icon: <LayoutDashboard size={18} /> },
  { key: "company", label: "Empresas", icon: <Building2 size={18} /> },
  { key: "account", label: "Contas", icon: <Landmark size={18} /> },
  { key: "category", label: "Categorias", icon: <Tag size={18} /> },

  {
    key: "transaction",
    label: "Transações",
    icon: <ArrowLeftRight size={18} />,
  },
  { key: "cnab", label: "CNAB", icon: <FileInput size={18} /> },
  {
    key: "notify",
    label: "Notificações",
    icon: <RotateCcw size={18} />,
  },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              className={`sidebar-item ${activeTab === item.key ? "active" : ""}`}
              to={{ pathname: `/${item.key}` }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
