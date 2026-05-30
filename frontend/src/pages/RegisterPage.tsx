import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register({ name, email, password });
      setSuccess("Conta criada! Redirecionando...");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setError("Erro ao criar conta. Tente outro email.");
    }
  };

  return (
    <div className="page-center">
      <form onSubmit={handleSubmit} className="form-card">
        <h2>Registrar</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Criar Conta</button>
        <p className="link-text">
          Já tem conta? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
