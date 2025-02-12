/* eslint-disable prettier/prettier */
import { helper } from '@ember/component/helper';

export default helper(function formatDate([date]: [string]) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
});
