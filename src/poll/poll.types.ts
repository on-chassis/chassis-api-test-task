export type SectionDbData = {
  poll?: {
    id: number;
  };
  name: string;
  id?: number;
};

export type QuestionDbData = {
  section: {
    id: number;
  };
  text: string;
  id?: number;
};

export type Section = {
  id?: number;
  name: string;
  questions: Array<string>;
};
