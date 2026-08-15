import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { Builder } from './components/layout/Builder';
import { Header } from './components/layout/Header';
import { ResumeList } from './components/layout/ResumeList';
import { ensurePresets, useResumeStore } from './store/resumeStore';
import { useUiStore } from './store/uiStore';

/** Ruta del editor: busca el CV por el :resumeId de la URL. Si no existe, a la lista. */
function BuilderRoute() {
  const { resumeId } = useParams();
  const resumes = useResumeStore((s) => s.resumes);
  const setActiveResume = useResumeStore((s) => s.setActiveResume);
  const resume = resumes.find((r) => r.id === resumeId);

  // La URL es la fuente de verdad: sincroniza el CV activo con la ruta.
  useEffect(() => {
    if (resume) setActiveResume(resume.id);
  }, [resume, setActiveResume]);

  if (!resume) return <Navigate to="/" replace />;
  return <Builder key={resume.id} resume={resume} />;
}

function Shell() {
  const location = useLocation();
  // Al cambiar de página, los paneles flotantes (Tema / ATS) se cierran.
  useEffect(() => {
    useUiStore.setState({ showThemePanel: false, showAtsPanel: false });
  }, [location.pathname]);

  return (
    <div className="app">
      <Header />
      <Outlet />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Idempotente: siembra/deduplica/migra presets y respeta borrados posteriores.
    ensurePresets();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<ResumeList />} />
          <Route path="/cv/:resumeId" element={<BuilderRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
