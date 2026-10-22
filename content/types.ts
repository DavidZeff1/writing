export type Example = { label: string; text: string; note: string };
export type Exercise = { title: string; prompt: string; hint: string; sample: string };
export type Criterion = { name: string; meets: string; developing: string; revisit: string };
export type Lesson = {
  id: string; unit: number; title: string; objective: string;
  kind?: 'lesson' | 'baseline' | 'workshop' | 'checkpoint' | 'portfolio';
  explanation: string[]; examples: Example[]; exercises: Exercise[];
  checklist: string[]; revision: string; transfer: { text: string; lesson: string };
  extra: string; rubric?: Criterion[]; material?: string; assignment?: string;
};
export type Unit = { number: number; title: string; description: string; lessons: Lesson[] };
// Short constructors keep authored course material separate from interface markup.
export const ex = (title: string, prompt: string, hint: string, sample: string): Exercise => ({title,prompt,hint,sample});
export const example = (label: string, text: string, note: string): Example => ({label,text,note});
export const criterion = (name: string, meets: string, developing: string, revisit: string): Criterion => ({name,meets,developing,revisit});
