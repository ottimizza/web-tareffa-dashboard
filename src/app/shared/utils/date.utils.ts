export class DateUtils {
  public static iterateDays(
    symbol: 1 | -1,
    verification: (date: Date, days: number) => boolean,
    days = 0,
    maxCallTimes = 63
  ): Date {
    for (let i = days; i < maxCallTimes; i++) {
      const date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000 * symbol);
      if (verification(date, i * symbol)) {
        return date;
      }
    }
  }

  public static format(date: Date): string {
    let day: string = date.getDate().toString();
    day = +day < 10 ? '0' + day : day;
    let month: string = (date.getMonth() + 1).toString();
    month = +month < 10 ? '0' + month : month;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
