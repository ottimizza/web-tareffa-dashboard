export class DateUtils {
  public static iterateDays(
    symbol: 1 | -1,
    verification: (date: Date, days: number) => boolean,
    days = 0
  ): Date {
    const date = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000 * symbol);
    if (verification(date, days * symbol)) {
      return DateUtils.iterateDays(symbol, verification, days + 1);
    }
    return date;
  }
}
