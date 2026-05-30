import { useEffect, useState, type FormEvent } from "react";
import { createTransaction } from "../api/transactions";
import { listAccounts, type AccountResponse } from "../api/accounts";
import { listCategories, type CategoryResponse } from "../api/categories";

interface Props {
  onCreated?: () => void;
}

export function CreateTransactionForm({ onCreated }: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [message, setMessage] = useState("");
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    listAccounts().then((res) => setAccounts(res.data)).catch(() => {});
    listCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await createTransaction({
        amount: parseFloat(amount),
        description,
        accountId: parseInt(accountId),
        categoryId: parseInt(categoryId),
        transactionDate: transactionDate || undefined,
      });
      setMessage("Transação criada com sucesso!");
      setAmount("");
      setDescription("");
      setAccountId("");
      setCategoryId("");
      setTransactionDate("");
      onCreated?.();
    } catch {
      setMessage("Erro ao criar transação.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <h3>Nova Transação</h3>
      {message && <p className="info">{message}</p>}
      <input
        type="number"
        step="0.01"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <label className="form-label">
        Data da transação
        <input
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
        />
      </label>
      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        required
      >
        <option value="">Selecione a conta</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name} ({a.type} - {a.currency})
          </option>
        ))}
      </select>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">Selecione a categoria</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.type === "INCOME" ? "Receita" : "Despesa"})
          </option>
        ))}
      </select>
      <button type="submit">Criar</button>
    </form>
  );
}
