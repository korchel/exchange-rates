import { format } from 'date-fns';

const getDates = (start: string, end: string): string[] => {
  const result: string[] = [];
  for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
    result.push(format(d, 'yyyy-MM-dd'));
  }
  return result;
};

export default getDates;
