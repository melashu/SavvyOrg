import { helper } from '@ember/component/helper';

export default helper(function eq([a, b]: [unknown, unknown]): boolean {
  return a === b;
});
