import { useEffect, useState } from "react";
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
import { Sidebar, type Tab } from "../components/Sidebar";

import { listCompanies, type CompanyResponse } from "../api/companies";
import { CreateAccountForm } from "../components/CreateAccountForm";
import { CreateCategoryForm } from "../components/CreateCategoryForm";
import { CreateTransactionForm } from "../components/CreateTransactionForm";
import { CreateCompanyForm } from "../components/CreateCompanyForm";
import { TransactionModal } from "../components/TransactionModal";
import { AccountStatementModal } from "../components/AccountStatementModal";
import { CompanyDashboardModal } from "../components/CompanyDashboardModal";

import { Toast } from "../components/Toast";
import {

  Building2,
  TrendingUp,
  TrendingDown,
  Scale,
  CirclePlus,
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
import NotificationsPanel from "../components/NotificationsPanel";
import CnabMonitor from "../components/CnabMonitor";
import BudgetPanel from "../components/BudgetPanel";
import AnomaliesPanel from "../components/AnomaliesPanel";
import StoragePanel from "../components/StoragePanel";



const MONTH_NAMES_SHORT = [
  "",
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const CURRENCY_SYMBOL: Record<string, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
};

const PIE_COLORS = [
  "#3498db",
  "#e74c3c",
  "#27ae60",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#2980b9",
  "#c0392b",
  "#16a085",
];



export function DashboardPage() {
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

  const [toast, setToast] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const loadData = async () => {
    try {
      const [catRes, txRes, balanceRes, accRes, compRes] = await Promise.all([
        listCategories(),
        listTransactionsByCategory(),
        getMonthlyBalance(),
        getAccountBalances(),
        listCompanies(),
      ]);
      setCategories(catRes.data);
      setTransactions(txRes.data);
      setMonthlyBalance(balanceRes.data);
      setAccountBalances(accRes.data);
      setCompanies(compRes.data);
    } catch {
      // token expired
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Computed data for charts
  const chartData = [...monthlyBalance].reverse().map((b) => ({
    name: `${MONTH_NAMES_SHORT[b.month]}/${b.year.toString().slice(2)}`,
    receitas: b.totalIncome,
    despesas: b.totalExpense,
    saldo: b.balance,
  }));
  console.log(chartData);

  const pieData = transactions.map((t) => ({
    name: t.categoryName,
    value: t.amount,
    type: t.type,
  }));

  const totalIncome = monthlyBalance.reduce((sum, b) => sum + b.totalIncome, 0);
  const totalExpense = monthlyBalance.reduce(
    (sum, b) => sum + b.totalExpense,
    0,
  );
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="app-layout">
      <div className="app-body">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

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
                  <div
                    className={`summary-card-icon ${totalBalance >= 0 ? "income-bg" : "expense-bg"}`}
                  >
                    <Scale size={20} />
                  </div>
                  <div className="summary-card-info">
                    <span className="summary-card-label">Saldo Geral</span>
                    <span
                      className={`summary-card-value ${totalBalance >= 0 ? "income" : "expense"}`}
                    >
                      R$ {totalBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Balance Cards */}
              <section className="section">
                <h3>Minhas Contas</h3>
                {accountBalances.length === 0 ? (
                  <>
                    <p className="empty-state">
                      Nenhuma conta com movimentação.
                    </p>
                  </>
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
                          <span className="account-name">
                            {acc.accountName}
                          </span>
                          <span className="account-type">{acc.type}</span>
                        </div>
                        <div
                          className={`account-balance ${acc.balance >= 0 ? "positive" : "negative"}`}
                        >
                          {CURRENCY_SYMBOL[acc.currency] || acc.currency}{" "}
                          {acc.balance.toFixed(2)}
                        </div>
                        <div className="account-details">
                          <span className="income">
                            ↑ {CURRENCY_SYMBOL[acc.currency]}{" "}
                            {acc.totalIncome.toFixed(2)}
                          </span>
                          <span className="expense">
                            ↓ {CURRENCY_SYMBOL[acc.currency]}{" "}
                            {acc.totalExpense.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             
              </section>

              {/* Charts Row */}
              <div className="charts-row">
                <div style={{ flex: 1 }}>
                  <NotificationsPanel />
                  <CnabMonitor />
                </div>
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
                          onClick={() =>
                            setSelectedCompany({ id: c.id, name: c.name })
                          }
                        >
                          <Building2 size={16} />
                          <div className="company-info">
                            <span className="company-name">{c.name}</span>
                            {c.cnpj && (
                              <span className="company-cnpj">{c.cnpj}</span>
                            )}
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
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value: number) =>
                            `R$ ${value.toFixed(2)}`
                          }
                          contentStyle={{
                            borderRadius: 8,
                            border: "1px solid #a09a9a",
                          }}
                        />
                        <Bar
                          dataKey="receitas"
                          fill="#27ae60"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="despesas"
                          fill="#e74c3c"
                          radius={[4, 4, 0, 0]}
                        />
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
                            <Cell
                              key={index}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) =>
                            `R$ ${value.toFixed(2)}`
                          }
                        />
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
                <div style={{ flex: 1 }}>
                  <BudgetPanel />
                  <AnomaliesPanel />
                  <StoragePanel />
                </div>
              </div>

              {/* Transactions by Category Table */}
              <section className="section">
                <h3>Transações por Categoria</h3>
                <p className="hint">
                  Clique numa categoria para ver os detalhes
                </p>
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
                            <td
                              className={
                                t.type === "INCOME" ? "income" : "expense"
                              }
                            >
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
