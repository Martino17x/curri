import { useEffect } from 'react';
import { Builder } from './components/layout/Builder';
import { Header } from './components/layout/Header';
import { ResumeList } from './components/layout/ResumeList';
import { selectResume, useResumeStore } from './store/resumeStore';
import { useUiStore } from './store/uiStore';

export default function App() {
  const resumes = useResumeStore((s) => s.resumes);
  const addSampleResume = useResumeStore((s) => s.addSampleResume);
  const activeResumeId = useResumeStore((s) => s.activeResumeId);
  const view = useUiStore((s) => s.view);

  useEffect(() => {
    // Guard idempotente: en StrictMode (dev) el efecto corre 2 veces y el closure
    // queda con valores viejos; leer el estado actual evita sembrar 2 CVs de ejemplo.
    const { seeded: s, resumes: rs } = useResumeStore.getState();
    if (!s && rs.length === 0) {
      addSampleResume();
    }
  }, [addSampleResume]);

  const resume = selectResume(resumes, activeResumeId);

  return (
    <div className="app">
      <Header
        resume={
          resume
            ? { id: resume.id, documentName: resume.documentName, templateId: resume.templateId }
            : undefined
        }
      />
      {view.name === 'list' || !resume ? <ResumeList /> : <Builder key={resume.id} resume={resume} />}
    </div>
  );
}
