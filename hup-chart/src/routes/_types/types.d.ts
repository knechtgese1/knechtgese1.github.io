export type Data = {
  component?: string;
  minimum?: number;
  maximum?: number;
  units?: string;
  data: Point[];
};

export type Point = {
  date: number;
  dateString: string;
  timeString: string;
  value: number;
};