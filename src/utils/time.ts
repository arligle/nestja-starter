import dayjs, { UnitType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export function diffNow(
  dateString: string,
  offset: number = 0,
  unit: UnitType = 'millisecond',
) {
  // TODO
  const now = dayjs().utc().add(offset, 'hour');
  const targetDate = dayjs(dateString).utc();

  const diff = targetDate.diff(now, unit);
  return diff;
}
