export class JSONUtils {
  public static DATE_HANDLER_TAG = 'json-utils-date-handler:';

  public static reBuild<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
  }

  public static reBuildWithDate<T>(object: T, dateHandlerTag = this.DATE_HANDLER_TAG): T {
    let props = Object.values(object);
    props.forEach((property, index) => {
      if (property instanceof Date) {
        const key = Object.keys(object)[index];
        object[key] = dateHandlerTag + property.getTime();
      }
    });

    const newObject = this.reBuild<T>(object);
    props = Object.values(newObject);
    props.forEach((property, index) => {
      if (typeof property === 'string' && property.startsWith(dateHandlerTag)) {
        const date = +property.replace(dateHandlerTag, '');
        const key = Object.keys(newObject)[index];
        newObject[key] = new Date(date);
      }
    });

    return newObject;
  }
}
