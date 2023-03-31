import catchAsync from './catchAsync';
import pick from './pick';
import authLimiter from './rateLimiter';

function arrayToObject<T, K extends keyof T>(arr: T[], keyField: K): Record<string, T> {
  return arr.reduce((obj: Record<string, T>, item: T) => {
    obj[String(item[keyField])] = item;
    return obj;
  }, {});
}

export { catchAsync, pick, authLimiter,arrayToObject };
