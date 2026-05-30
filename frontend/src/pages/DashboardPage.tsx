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
import { CreateAccountForm } from "../components/CreateAccountForm";
import { CreateCategoryForm } from "../components/CreateCategoryForm";
import { CreateTransactionForm } from "../components/CreateTransactionForm";
import { TransactionModal } from "../components/TransactionModal";
import { AccountStatementModal } from "../components/AccountStatementModal";

const MONTH_NAMES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const CURRENCY_SYMBOL: Record<string, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
};

export function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionByCategory[]>([]);
  const [monthlyBalance, setMonthlyBalance] = useState<MonthlyBalance[]>([]);
  const [accountBalances, setAccountBalances] = useState<AccountBalance[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "account" | "category" | "transaction"
  >("overview");
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<{
    id: number;
    name: string;
    currency: string;
  } | null>(null);

  const loadData = async () => {
    try {
      const [catRes, txRes, balanceRes, accRes] = await Promise.all([
        listCategories(),
        listTransactionsByCategory(),
        getMonthlyBalance(),
        getAccountBalances(),
      ]);
      setCategories(catRes.data);
      setTransactions(txRes.data);
      setMonthlyBalance(balanceRes.data);
      setAccountBalances(accRes.data);
    } catch {
      // token expired
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Finance Manager</h1>
        <button onClick={handleLogout} className="btn-logout">
          Sair
        </button>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Resumo
        </button>
        <button
          className={activeTab === "account" ? "active" : ""}
          onClick={() => setActiveTab("account")}
        >
          Nova Conta
        </button>
        <button
          className={activeTab === "category" ? "active" : ""}
          onClick={() => setActiveTab("category")}
        >
          Nova Categoria
        </button>
        <button
          className={activeTab === "transaction" ? "active" : ""}
          onClick={() => setActiveTab("transaction")}
        >
          Nova Transação
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === "overview" && (
          <div>
            {/* Account Balance Cards */}
            <h3>Minhas Contas</h3>
            {accountBalances.length === 0 ? (
              <p>Nenhuma conta com movimentação.</p>
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

            {/* Monthly Balance */}
            <h3 style={{ marginTop: "2rem" }}>Balanço Mensal</h3>
            {monthlyBalance.length === 0 ? (
              <p>Nenhum dado disponível.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Receitas</th>
                    <th>Despesas</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyBalance.map((b, i) => (
                    <tr key={i}>
                      <td>{MONTH_NAMES[b.month]} {b.year}</td>
                      <td className="income">R$ {b.totalIncome.toFixed(2)}</td>
                      <td className="expense">R$ {b.totalExpense.toFixed(2)}</td>
                      <td className={b.balance >= 0 ? "income" : "expense"}>
                        R$ {b.balance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Transactions by Category */}
            <h3 style={{ marginTop: "2rem" }}>Transações por Categoria</h3>
            <p className="hint">Clique numa categoria para ver os detalhes</p>
            {transactions.length === 0 ? (
              <p>Nenhuma transação registrada.</p>
            ) : (
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
            )}

            {/* Categories list */}
            <h3 style={{ marginTop: "2rem" }}>Categorias</h3>
            {categories.length === 0 ? (
              <p>Nenhuma categoria cadastrada.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td className={c.type === "INCOME" ? "income" : "expense"}>
                        {c.type === "INCOME" ? "Receita" : "Despesa"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "account" && <CreateAccountForm />}
        {activeTab === "category" && <CreateCategoryForm onCreated={loadData} />}
        {activeTab === "transaction" && <CreateTransactionForm onCreated={loadData} />}
      </main>

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
    </div>
  );
}
