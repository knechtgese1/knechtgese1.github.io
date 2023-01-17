export const convertTime = (time: string) => {
  if (!time) {
    return [12, 0]; // return noon if no time is given
  }
  const [clock, modifier] = time.split(' ');
  const [hr, min] = clock.split(':');
  let hours = Number(hr) % 12;
  const minutes = Number(min);
  if (modifier === 'PM') hours += 12;
  return [hours, minutes];
};

export const getMs = (rawDate: string, time: string) => {
  const [hours, minutes] = convertTime(time);
  const date = new Date(rawDate);
  date.setHours(hours);
  date.setMinutes(minutes);
  return date;
};