export { isObject } from 'graphql-compose';

export const isError = (val) => typeof val === 'object' && val != null && val instanceof Error;
