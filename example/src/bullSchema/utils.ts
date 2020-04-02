export const isObject = (val) =>
  typeof val === 'object' && val != null && !Array.isArray(val) && !(val instanceof Error);

export const isError = (val) => typeof val === 'object' && val != null && val instanceof Error;
