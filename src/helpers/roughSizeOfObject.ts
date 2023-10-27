import { Options } from '../definitions';

function roughSizeOfObject(object: unknown): number {
  const objectList = [];
  const stack = [object];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    } else if (typeof value === 'string') {
      bytes += value.length * 2;
    } else if (typeof value === 'number') {
      bytes += 8;
    } else if (typeof value === 'object' && objectList.indexOf(value as never) === -1) {
      objectList.push(value as never);

      for (const i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}

export const defaultMaxSizeOfObjectData = 10000;

export function checkJobDataSize(opts: Options, data: unknown): void {
  const allowableSize = opts?.maxSizeOfJobData || defaultMaxSizeOfObjectData;
  const size = roughSizeOfObject(data);
  if (size > allowableSize) {
    throw new Error(`Job data ${size} exceeds allowable size ${allowableSize}`);
  }
}
