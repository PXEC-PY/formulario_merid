import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Home } from "./pages/Home";
import { PersonasFisicasPage } from "./pages/forms/PersonasFisicasPage";
import { DenunciaRiesgosVariosPage } from "./pages/forms/DenunciaRiesgosVariosPage";
import { DenunciaTransportePage } from "./pages/forms/DenunciaTransportePage";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personas-fisicas" element={<PersonasFisicasPage />} />
        <Route path="/denuncia/riesgos-varios" element={<DenunciaRiesgosVariosPage />} />
        <Route path="/denuncia/transporte" element={<DenunciaTransportePage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
