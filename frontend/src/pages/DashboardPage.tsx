import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { listCategories, type CategoryResponse } from "../api/categories";
import {
  listTransactionsByCategory,
  type TransactionByCategory,
} from "../api/transactions";
import {
  getMonthlyBalance,
  getAccountBalances,
  type MonthlyBalance,
  type AccountBalance,
} from "../api/reports";
import { getUnreadCount } from "../api/notifications";
import { listCompanies, type CompanyResponse } from "../api/companies";
import { CreateAccountForm } from "../components/CreateAccountForm";
import { CreateCategoryForm } from "../components/CreateCategoryForm";
import { CreateTransactionForm } from "../components/CreateTransactionForm";
import { CreateCompanyForm } from "../components/CreateCompanyForm";
import { TransactionModal } from "../components/TransactionModal";
import { AccountStatementModal } from "../components/AccountStatementModal";
import { CompanyDashboardModal } from "../components/CompanyDashboardModal";
import { NotificationPanel } from "../components/NotificationPanel";
import { Toast } from "../components/Toast";
import {
  LayoutDashboard,
  Landmark,
  Tag,
  ArrowLeftRight,
  Bell,
  LogOut,
  Wallet,
  Building2,
  TrendingUp,
  TrendingDown,
  Scale,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const MONTH_NAMES_SHORT = [
  "", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const CURRENCY_SYMBOL: Record<string, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
};

const PIE_COLORS = [
  "#3498db", "#e74c3c", "#27ae60", "#f39c12", "#9b59b6",
  "#1abc9c", "#e67e22", "#2980b9", "#c0392b", "#16a085",
];

type Tab = "overview" | "account" | "category" | "transaction" | "company";

const NAV_ITEMS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Home", icon: <LayoutDashboard size={18} /> },
  { key: "company", label: "Empresas", icon: <Building2 size={18} /> },
  { key: "account", label: "Contas", icon: <Landmark size={18} /> },
  { key: "category", label: "Categorias", icon: <Tag size={18} /> },
  { key: "transaction", label: "Transações", icon: <ArrowLeftRight size={18} /> },
];

export function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionByCategory[]>([]);
  const [monthlyBalance, setMonthlyBalance] = useState<MonthlyBalance[]>([]);
  const [accountBalances, setAccountBalances] = useState<AccountBalance[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<{
    id: number;
    name: string;
    currency: string;
  } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const loadData = async () => {
    try {
      const [catRes, txRes, balanceRes, accRes, notifRes, compRes] = await Promise.all([
        listCategories(),
        listTransactionsByCategory(),
        getMonthlyBalance(),
        getAccountBalances(),
        getUnreadCount(),
        listCompanies(),
      ]);
      setCategories(catRes.data);
      setTransactions(txRes.data);
      setMonthlyBalance(balanceRes.data);
      setAccountBalances(accRes.data);
      setUnreadCount(notifRes.data);
      setCompanies(compRes.data);
    } catch {
      // token expired
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getUnreadCount().then((res) => setUnreadCount(res.data)).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Computed data for charts
  const chartData = [...monthlyBalance].reverse().map((b) => ({
    name: `${MONTH_NAMES_SHORT[b.month]}/${b.year.toString().slice(2)}`,
    receitas: b.totalIncome,
    despesas: b.totalExpense,
    saldo: b.balance,
  }));

  const pieData = transactions.map((t) => ({
    name: t.categoryName,
    value: t.amount,
    type: t.type,
  }));

  const totalIncome = monthlyBalance.reduce((sum, b) => sum + b.totalIncome, 0);
  const totalExpense = monthlyBalance.reduce((sum, b) => sum + b.totalExpense, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="app-layout">
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-brand">
          <Wallet size={22} color="#fff" />
          <h1>Finance Manager</h1>
        </div>
        <div className="topbar-actions">
          <button
            className="btn-notification"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} color="#fff" />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {showNotifications && (
        <NotificationPanel
          onClose={() => {
            setShowNotifications(false);
            getUnreadCount().then((res) => setUnreadCount(res.data)).catch(() => {});
          }}
        />
      )}

      <div className="app-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                className={`sidebar-item ${activeTab === item.key ? "active" : ""}`}
                onClick={() => setActiveTab(item.key)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {activeTab === "overview" && (
            <div>
              <h2 className="page-title">Home</h2>

              {/* Summary Cards */}
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="summary-card-icon income-bg">
                    <TrendingUp size={20} />
                  </div>
                  <div className="summary-card-info">
                    <span className="summary-card-label">Total Receitas</span>
                    <span className="summary-card-value income">
                      R$ {totalIncome.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-card-icon expense-bg">
                    <TrendingDown size={20} />
                  </div>
                  <div className="summary-card-info">
                    <span className="summary-card-label">Total Despesas</span>
                    <span className="summary-card-value expense">
                      R$ {totalExpense.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className={`summary-card-icon ${totalBalance >= 0 ? "income-bg" : "expense-bg"}`}>
                    <Scale size={20} />
                  </div>
                  <div className="summary-card-info">
                    <span className="summary-card-label">Saldo Geral</span>
                    <span className={`summary-card-value ${totalBalance >= 0 ? "income" : "expense"}`}>
                      R$ {totalBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Balance Cards */}
              <section className="section">
                <h3>Minhas Contas</h3>
                {accountBalances.length === 0 ? (
                  <p className="empty-state">Nenhuma conta com movimentação.</p>
                ) : (
                  <div className="account-cards">
                    {accountBalances.map((acc) => (
                      <div
                        key={acc.accountId}
                        className="account-card clickable"
                        onClick={() =>
                          setSelectedAccount({
                            id: acc.accountId,
                            name: acc.accountName,
                            currency: acc.currency,
                          })
                        }
                      >
                        <div className="account-card-header">
                          <span className="account-name">{acc.accountName}</span>
                          <span className="account-type">{acc.type}</span>
                        </div>
                        <div className={`account-balance ${acc.balance >= 0 ? "positive" : "negative"}`}>
                          {CURRENCY_SYMBOL[acc.currency] || acc.currency} {acc.balance.toFixed(2)}
                        </div>
                        <div className="account-details">
                          <span className="income">↑ {CURRENCY_SYMBOL[acc.currency]} {acc.totalIncome.toFixed(2)}</span>
                          <span className="expense">↓ {CURRENCY_SYMBOL[acc.currency]} {acc.totalExpense.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Charts Row */}
              <div className="charts-row">

              {/* Companies Section */}
              <section className="section">
                <h3>Minhas Empresas</h3>
                {companies.length === 0 ? (
                  <p className="empty-state">Nenhuma empresa cadastrada.</p>
                ) : (
                  <div className="company-list">
                    {companies.map((c) => (
                      <div
                        key={c.id}
                        className="company-item clickable"
                        onClick={() => setSelectedCompany({ id: c.id, name: c.name })}
                      >
                        <Building2 size={16} />
                        <div className="company-info">
                          <span className="company-name">{c.name}</span>
                          {c.cnpj && <span className="company-cnpj">{c.cnpj}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
                {/* Bar Chart - Monthly Balance */}
                <section className="section chart-section">
                  <h3>Receitas vs Despesas</h3>
                  {chartData.length === 0 ? (
                    <p className="empty-state">Sem dados para exibir.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                          contentStyle={{ borderRadius: 8, border: "1px solid #eee" }}
                        />
                        <Bar dataKey="receitas" fill="#27ae60" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="despesas" fill="#e74c3c" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </section>

                {/* Pie Chart - By Category */}
                <section className="section chart-section">
                  <h3>Distribuição por Categoria</h3>
                  {pieData.length === 0 ? (
                    <p className="empty-state">Sem dados para exibir.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          nameKey="name"
                        >
                          {pieData.map((_, index) => (
                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                        <Legend
                          layout="vertical"
                          align="right"
                          verticalAlign="middle"
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </section>
              </div>

              {/* Transactions by Category Table */}
              <section className="section">
                <h3>Transações por Categoria</h3>
                <p className="hint">Clique numa categoria para ver os detalhes</p>
                {transactions.length === 0 ? (
                  <p className="empty-state">Nenhuma transação registrada.</p>
                ) : (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Categoria</th>
                          <th>Tipo</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((t) => (
                          <tr
                            key={t.categoryId}
                            className="clickable-row"
                            onClick={() =>
                              setSelectedCategory({
                                id: t.categoryId,
                                name: t.categoryName,
                              })
                            }
                          >
                            <td>{t.categoryName}</td>
                            <td className={t.type === "INCOME" ? "income" : "expense"}>
                              {t.type === "INCOME" ? "Receita" : "Despesa"}
                            </td>
                            <td>R$ {t.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === "account" && (
            <div>
              <h2 className="page-title">Nova Conta</h2>
              <CreateAccountForm />
            </div>
          )}
          {activeTab === "company" && (
            <div>
              <h2 className="page-title">Empresas</h2>
              <CreateCompanyForm onCreated={loadData} />
            </div>
          )}
          {activeTab === "category" && (
            <div>
              <h2 className="page-title">Nova Categoria</h2>
              <CreateCategoryForm onCreated={loadData} />
            </div>
          )}
          {activeTab === "transaction" && (
            <div>
              <h2 className="page-title">Nova Transação</h2>
              <CreateTransactionForm
                onCreated={() => {
                  loadData();
                  setToast("Transação criada com sucesso!");
                }}
              />
            </div>
          )}
        </main>
      </div>

      {selectedCategory && (
        <TransactionModal
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          onClose={() => setSelectedCategory(null)}
        />
      )}

      {selectedAccount && (
        <AccountStatementModal
          accountId={selectedAccount.id}
          accountName={selectedAccount.name}
          currency={selectedAccount.currency}
          onClose={() => setSelectedAccount(null)}
        />
      )}

      {selectedCompany && (
        <CompanyDashboardModal
          companyId={selectedCompany.id}
          companyName={selectedCompany.name}
          onClose={() => setSelectedCompany(null)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
