import { useEffect, useState } from "react";
import { getTransactionsByCategory, type TransactionDetail } from "../api/reports";

interface Props {
  categoryId: number;
  categoryName: string;
  onClose: () => void;
}

export function TransactionModal({ categoryId, categoryName, onClose }: Props) {
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactionsByCategory(categoryId)
      .then((res) => setTransactions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Transações — {categoryName}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {loading ? (
            <p>Carregando...</p>
          ) : transactions.length === 0 ? (
            <p>Nenhuma transação nesta categoria.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.description}</td>
                    <td className={t.categoryType === "INCOME" ? "income" : "expense"}>
                      {t.categoryType === "INCOME" ? "+" : "-"} R$ {t.amount.toFixed(2)}
                    </td>
                    <td>{new Date(t.transactionDate).toLocaleDateString("pt-BR")}</td>
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
