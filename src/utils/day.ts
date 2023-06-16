import dayjs from 'dayjs'

export function timeFormat(time: number, rule: string) {
  return dayjs(time).format(rule)
}

export function timeToUnixFormat(time: string) {
  return dayjs(time).valueOf()
}
