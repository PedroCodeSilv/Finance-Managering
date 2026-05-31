import { useState, type FormEvent } from "react";
import { createCategory, type CategoryType } from "../api/categories";

interface Props {
  onCreated?: () => void;
}

export function CreateCategoryForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("EXPENSE");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await createCategory({ name, type });
      setMessage("Categoria criada com sucesso!");
      setName("");
      onCreated?.();
    } catch {
      setMessage("Erro ao criar categoria.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <h3>Nova Categoria</h3>
      {message && <p className="info">{message}</p>}
      <input
        type="text"
        placeholder="Nome da categoria"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select value={type} onChange={(e) => setType(e.target.value as CategoryType)}>
        <option value="EXPENSE">Despesa</option>
        <option value="INCOME">Receita</option>
      </select>
      <button type="submit">Criar</button>
    </form>
  );
}
