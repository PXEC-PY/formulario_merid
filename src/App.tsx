import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Home } from "./pages/Home";
import { PersonasFisicasPage } from "./pages/forms/PersonasFisicasPage";
import { DenunciaRiesgosVariosPage } from "./pages/forms/DenunciaRiesgosVariosPage";
import { DenunciaTransportePage } from "./pages/forms/DenunciaTransportePage";
import { DenunciaAutomovilPage } from "./pages/forms/DenunciaAutomovilPage";
import { RevisionAutomovilPage } from "./pages/forms/RevisionAutomovilPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { AuthCallbackPage } from "./pages/auth/AuthCallbackPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UsersPage } from "./pages/admin/UsersPage";
import { DepartmentsPage } from "./pages/admin/DepartmentsPage";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireRole } from "./components/auth/RequireRole";
import { ADMIN_ROLES, STAFF_ROLES } from "./types/roles";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/personas-fisicas"
          element={
            <RequireRole roles={STAFF_ROLES}>
              <PersonasFisicasPage />
            </RequireRole>
          }
        />
        <Route
          path="/denuncia/riesgos-varios"
          element={
            <RequireRole roles={STAFF_ROLES}>
              <DenunciaRiesgosVariosPage />
            </RequireRole>
          }
        />
        <Route
          path="/denuncia/transporte"
          element={
            <RequireRole roles={STAFF_ROLES}>
              <DenunciaTransportePage />
            </RequireRole>
          }
        />
        <Route
          path="/denuncia/automovil"
          element={
            <RequireRole roles={STAFF_ROLES}>
              <DenunciaAutomovilPage />
            </RequireRole>
          }
        />
        <Route
          path="/revision-automovil"
          element={
            <RequireRole roles={STAFF_ROLES}>
              <RevisionAutomovilPage />
            </RequireRole>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route
          path="/perfil"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <RequireRole roles={ADMIN_ROLES}>
              <UsersPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/departamentos"
          element={
            <RequireRole roles={ADMIN_ROLES}>
              <DepartmentsPage />
            </RequireRole>
          }
        />
      </Routes>
    </AppShell>
  );
}

export default App;
