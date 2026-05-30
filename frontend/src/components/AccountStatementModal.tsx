import { useEffect, useState } from "react";
import { getTransactionsByAccount, type TransactionDetail } from "../api/reports";

interface Props {
  accountId: number;
  accountName: string;
  currency: string;
  onClose: () => void;
}

const CURRENCY_SYMBOL: Record<string, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
};

export function AccountStatementModal({ accountId, accountName, currency, onClose }: Props) {
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const firstDayOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
  const todayStr = today.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(todayStr);

  const symbol = CURRENCY_SYMBOL[currency] || currency;

  const fetchTransactions = (start?: string, end?: string) => {
    setLoading(true);
    getTransactionsByAccount(accountId, start || undefined, end || undefined)
      .then((res) => setTransactions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions(startDate, endDate);
  }, [accountId]);

  const handleFilter = () => {
    fetchTransactions(startDate, endDate);
  };

  const handleClear = () => {
    setStartDate(firstDayOfMonth);
    setEndDate(todayStr);
    fetchTransactions(firstDayOfMonth, todayStr);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Extrato — {accountName}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="date-filter">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Data início"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Data fim"
            />
            <button className="btn-filter" onClick={handleFilter}>Filtrar</button>
            {(startDate || endDate) && (
              <button className="btn-clear" onClick={handleClear}>Limpar</button>
            )}
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : transactions.length === 0 ? (
            <p>Nenhuma transação encontrada.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.transactionDate).toLocaleDateString("pt-BR")}</td>
                    <td>{t.description}</td>
                    <td className={t.categoryType === "INCOME" ? "income" : "expense"}>
                      {t.categoryType === "INCOME" ? "+" : "-"} {symbol} {t.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
