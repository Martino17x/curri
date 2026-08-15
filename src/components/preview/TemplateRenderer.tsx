import type { ComponentType } from 'react';
import type { Resume, TemplateId } from '../../types/resume';
import { TemplateClassic } from '../templates/TemplateClassic';
import { TemplateCreative } from '../templates/TemplateCreative';
import { TemplateExecutive } from '../templates/TemplateExecutive';
import { TemplateMinimal } from '../templates/TemplateMinimal';
import { TemplateModern } from '../templates/TemplateModern';

const TEMPLATES: Record<TemplateId, ComponentType<{ resume: Resume }>> = {
  modern: TemplateModern,
  classic: TemplateClassic,
  minimal: TemplateMinimal,
  executive: TemplateExecutive,
  creative: TemplateCreative,
};

export function TemplateRenderer({ resume }: { resume: Resume }) {
  const Component = TEMPLATES[resume.templateId] ?? TemplateModern;
  return <Component resume={resume} />;
}
