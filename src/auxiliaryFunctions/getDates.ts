import stringifyDate from './stringifyDate';

const getDates = (start: string, end: string): string[] => {
  const result: string[] = [];
  for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
    result.push(stringifyDate(d));
  }
  return result;
};

export default getDates;
