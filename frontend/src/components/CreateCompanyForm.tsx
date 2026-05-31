import { useState, type FormEvent } from "react";
import { createCompany } from "../api/companies";

interface Props {
  onCreated?: () => void;
}

export function CreateCompanyForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await createCompany({ name, cnpj: cnpj || undefined });
      setMessage("Empresa criada com sucesso!");
      setName("");
      setCnpj("");
      onCreated?.();
    } catch {
      setMessage("Erro ao criar empresa.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <h3>Nova Empresa</h3>
      {message && <p className="info">{message}</p>}
      <input
        type="text"
        placeholder="Nome da empresa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="CNPJ (opcional)"
        value={cnpj}
        onChange={(e) => setCnpj(e.target.value)}
      />
      <button type="submit">Criar</button>
    </form>
  );
}
