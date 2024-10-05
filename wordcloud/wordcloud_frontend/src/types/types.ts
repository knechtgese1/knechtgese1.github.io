export type User = {
  id: number;
  handle: string;
  firstName: string;
  lastName: string;
};
export type Word = {
  id: number;
  text: string;
  value: number;
  user: number;
};
export type Upvote = {
  userId: number;
  wordId: number;
};