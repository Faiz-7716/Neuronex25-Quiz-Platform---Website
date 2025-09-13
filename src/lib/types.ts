export type Team = {
  id: number;
  name: string;
  score: number;
  status: 'active' | 'eliminated';
};

export type QuestionStatus = 'available' | 'attempted' | 'correct' | 'wrong';

export type Question = {
  id: number;
  round: number;
  type: 'mcq' | 'logo' | 'code';
  language?: 'python' | 'java' | 'cpp';
  content: string;
  options?: string[];
  answer: string;
  status: QuestionStatus;
};

export type GameState = 'intro' | 'transition' | 'round' | 'roundover' | 'gameover';

export type RoundDetail = {
  title: string;
  teamsAdvancing: number;
  teamsEliminated: number;
  rules: string;
};

export type RoundDetails = {
  [key: number]: RoundDetail;
};
