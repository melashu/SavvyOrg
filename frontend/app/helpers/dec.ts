import { helper } from '@ember/component/helper';

export default helper(function dec([value]: [number]): number {
  // Ensure the value is a number
  if (typeof value !== 'number') {
    throw new Error('Expected a number');
  }
  return value - 1;
});
