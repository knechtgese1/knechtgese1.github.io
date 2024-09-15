export type AppMode = 'edit' | 'define';

export type ButtonDef = {
  index: number;
  name: string;
  display: string;
  options?: number[];
  text?: string;
}