import {
  LayoutDashboard,
  Building2,
  Landmark,
  Tag,
  ArrowLeftRight,
} from "lucide-react";

export type Tab =
  | "overview"
  | "account"
  | "category"
  | "transaction"
  | "company";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Home", icon: <LayoutDashboard size={18} /> },
  { key: "company", label: "Empresas", icon: <Building2 size={18} /> },
  { key: "account", label: "Contas", icon: <Landmark size={18} /> },
  { key: "category", label: "Categorias", icon: <Tag size={18} /> },
  {
    key: "transaction",
    label: "Transações",
    icon: <ArrowLeftRight size={18} />,
  },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`sidebar-item ${activeTab === item.key ? "active" : ""}`}
            onClick={() => onTabChange(item.key)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
