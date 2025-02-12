import { helper } from '@ember/component/helper';

export function firstLetter([name]: [string]): string {
  return name ? name.charAt(0).toUpperCase() : '';
}

export default helper(firstLetter);
