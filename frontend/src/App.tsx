import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/dash/DashboardPage";

//component

import { AppLayout } from "./pages/AppLayout";
import { CreateAccountForm } from "./components/account/CreateAccountForm";
import { CreateCompanyForm } from "./components/company/CreateCompanyForm";
import { CreateCategoryForm } from "./components/category/CreateCategoryForm";
import { CreateTransactionForm } from "./components/transaction/CreateTransactionForm";
import { CnabMonitor } from "./components/CnabMonitor";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/company" element={<CreateCompanyForm />} />
            <Route path="/account" element={<CreateAccountForm />} />
            <Route path="/category" element={<CreateCategoryForm />} />
            <Route path="/transaction" element={<CreateTransactionForm />} />
            <Route path="/cnab" element={<CnabMonitor />} />
            <Route path="/notify" element={<div>Notificações</div>} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
