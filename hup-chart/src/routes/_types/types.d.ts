export type Data = {
  component: string;
  minimum: number;
  maximum: number;
  units: string;
  firstDate: number;
  lastDate: number;
  data: Point[];
};

export type Point = {
  date: number;
  dateString: string;
  timeString: string;
  value: number;
};