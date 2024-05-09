import moment from 'moment';

const round = (value, precision) => Math.round(value / precision) * precision;

export default function roundTime(time, steps = 1) {
  const date = moment(time, 'HH:mm');
  return date.minutes(round(date.minutes(), steps)).format('HH:mm');
}
