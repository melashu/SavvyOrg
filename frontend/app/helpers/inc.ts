import { helper } from '@ember/component/helper';

export default helper(function inc([value]) {
  if (typeof value !== 'number') {
    throw new Error('Expected a number');
  }
  return value + 1;
});
