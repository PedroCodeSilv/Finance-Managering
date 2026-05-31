import { useEffect, useState } from "react";
import {
  getCompanyBalances,
  getCompanyMonthlyBalance,
  getCompanyByCategory,
  type AccountBalance,
  type MonthlyBalance,
} from "../api/reports";
import type { TransactionByCategory } from "../api/transactions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Scale } from "lucide-react";

interface Props {
  companyId: number;
  companyName: string;
  onClose: () => void;
}

const MONTH_NAMES_SHORT = [
  "", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const CURRENCY_SYMBOL: Record<string, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
};

export function CompanyDashboardModal({ companyId, companyName, onClose }: Props) {
  const [accounts, setAccounts] = useState<AccountBalance[]>([]);
  const [monthly, setMonthly] = useState<MonthlyBalance[]>([]);
  const [byCategory, setByCategory] = useState<TransactionByCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCompanyBalances(companyId),
      getCompanyMonthlyBalance(companyId),
      getCompanyByCategory(companyId),
    ])
      .then(([accRes, monthRes, catRes]) => {
        setAccounts(accRes.data);
        setMonthly(monthRes.data);
        setByCategory(catRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [companyId]);

  const totalIncome = monthly.reduce((s, b) => s + b.totalIncome, 0);
  const totalExpense = monthly.reduce((s, b) => s + b.totalExpense, 0);
  const totalBalance = totalIncome - totalExpense;

  const chartData = [...monthly].reverse().map((b) => ({
    name: `${MONTH_NAMES_SHORT[b.month]}/${b.year.toString().slice(2)}`,
    receitas: b.totalIncome,
    despesas: b.totalExpense,
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{companyName}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <>
              {/* Summary */}
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="summary-card-icon income-bg">
                    <TrendingUp size={18} />
                  </div>
                  <div className="summary-card-info">
                    <span className="summary-card-label">Receitas</span>
                    <span className="summary-card-value income">
                      R$ {totalIncome.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-card-icon expense-bg">
                    <TrendingDown size={18} />
                  </div>
                  <div className="summary-card-info">
                    <span className="summary-card-label">Despesas</span>
                    <span className="summary-card-value expense">
                      R$ {totalExpense.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className={`summary-card-icon ${totalBalance >= 0 ? "income-bg" : "expense-bg"}`}>
                    <Scale size={18} />
                  </div>
                  <div className="summary-card-info">
                    <span className="summary-card-label">Saldo</span>
                    <span className={`summary-card-value ${totalBalance >= 0 ? "income" : "expense"}`}>
                      R$ {totalBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accounts */}
              {accounts.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <h4 style={{ marginBottom: "0.75rem", color: "#2c3e50" }}>Contas da Empresa</h4>
                  <div className="account-cards">
                    {accounts.map((acc) => (
                      <div key={acc.accountId} className="account-card">
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
                </div>
              )}

              {/* Chart */}
              {chartData.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <h4 style={{ marginBottom: "0.75rem", color: "#2c3e50" }}>Receitas vs Despesas</h4>
                  <ResponsiveContainer width="100%" height={220}>
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
                </div>
              )}

              {/* By Category */}
              {byCategory.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <h4 style={{ marginBottom: "0.75rem", color: "#2c3e50" }}>Por Categoria</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Categoria</th>
                        <th>Tipo</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byCategory.map((t) => (
                        <tr key={t.categoryId}>
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

              {accounts.length === 0 && monthly.length === 0 && (
                <p className="empty-state" style={{ marginTop: "1rem" }}>
                  Nenhuma movimentação registrada para esta empresa.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
