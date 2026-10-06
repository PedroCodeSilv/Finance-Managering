import { useState, type FormEvent } from "react";
import { createCompany } from "../../api/companies";

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
    <main className="main-content">
      <h2 className="page-title">Nova Empresa</h2>
      <form onSubmit={handleSubmit} className="form-inline">
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
    </main>
  );
}
