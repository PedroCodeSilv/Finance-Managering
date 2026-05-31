import { useEffect, useState, type FormEvent } from "react";
import {
  createAccount,
  type AccountType,
  type AccountCurrency,
} from "../api/accounts";
import { listCompanies, type CompanyResponse } from "../api/companies";

export function CreateAccountForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("CHECKING");
  const [currency, setCurrency] = useState<AccountCurrency>("BRL");
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    listCompanies().then((res) => setCompanies(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await createAccount({
        name,
        type,
        currency,
        companyId: companyId ? parseInt(companyId) : undefined,
      });
      setMessage("Conta criada com sucesso!");
      setName("");
      setCompanyId("");
    } catch {
      setMessage("Erro ao criar conta.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <h3>Nova Conta</h3>
      {message && <p className="info">{message}</p>}
      <input
        type="text"
        placeholder="Nome da conta"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select value={type} onChange={(e) => setType(e.target.value as AccountType)}>
        <option value="CHECKING">Conta Corrente</option>
        <option value="CASH">Dinheiro</option>
        <option value="CREDIT">Crédito</option>
        <option value="DEBIT">Débito</option>
      </select>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as AccountCurrency)}
      >
        <option value="BRL">BRL</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
      <select
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
      >
        <option value="">Pessoal (sem empresa)</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} {c.cnpj ? `(${c.cnpj})` : ""}
          </option>
        ))}
      </select>
      <button type="submit">Criar</button>
    </form>
  );
}
