/* eslint-disable prettier/prettier */
import { helper } from '@ember/component/helper';

export default helper(function truncateWords([text, wordLimit]: [string, number]): string {
  if (typeof text !== 'string' || typeof wordLimit !== 'number') {
    console.error('Invalid input to truncate-words:', { text, wordLimit });
    return '';
  }
  const words = text.split(' ');
  if (words.length <= wordLimit) {
    return text;
  }
  const truncatedText = words.slice(0, wordLimit).join(' ') + '...';
  return truncatedText;
});
