export type Data = {
  component?: string;
  minimum?: number;
  maximum?: number;
  units?: string;
  data: Point[];
};

export type Point = {
  date: Date;
  dateString: string;
  timeString: string;
  value: number;
};