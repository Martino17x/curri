import { useEffect } from 'react';
import { Builder } from './components/layout/Builder';
import { Header } from './components/layout/Header';
import { ResumeList } from './components/layout/ResumeList';
import { ensurePresets, selectResume, useResumeStore } from './store/resumeStore';
import { useUiStore } from './store/uiStore';

export default function App() {
  const resumes = useResumeStore((s) => s.resumes);
  const activeResumeId = useResumeStore((s) => s.activeResumeId);
  const view = useUiStore((s) => s.view);

  useEffect(() => {
    // Idempotente: siembra/deduplica/migra presets y respeta borrados posteriores.
    ensurePresets();
  }, []);

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
