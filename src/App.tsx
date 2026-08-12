import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Home } from "./pages/Home";
import { PersonasFisicasPage } from "./pages/forms/PersonasFisicasPage";
import { DenunciaRiesgosVariosPage } from "./pages/forms/DenunciaRiesgosVariosPage";
import { DenunciaIncendioPage } from "./pages/forms/DenunciaIncendioPage";
import { DenunciaCristalesPage } from "./pages/forms/DenunciaCristalesPage";
import { DenunciaRoboPage } from "./pages/forms/DenunciaRoboPage";
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
import { DownloadsPage } from "./pages/admin/DownloadsPage";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireRole } from "./components/auth/RequireRole";
import { ADMIN_ROLES } from "./types/roles";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personas-fisicas" element={<PersonasFisicasPage />} />
        <Route path="/denuncia/riesgos-varios" element={<DenunciaRiesgosVariosPage />} />
        <Route path="/denuncia/incendio" element={<DenunciaIncendioPage />} />
        <Route path="/denuncia/cristales" element={<DenunciaCristalesPage />} />
        <Route path="/denuncia/robo" element={<DenunciaRoboPage />} />
        <Route path="/denuncia/transporte" element={<DenunciaTransportePage />} />
        <Route path="/denuncia/automovil" element={<DenunciaAutomovilPage />} />
        <Route path="/revision-automovil" element={<RevisionAutomovilPage />} />
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
        <Route
          path="/admin/descargas"
          element={
            <RequireRole roles={ADMIN_ROLES}>
              <DownloadsPage />
            </RequireRole>
          }
        />
      </Routes>
    </AppShell>
  );
}

export default App;
