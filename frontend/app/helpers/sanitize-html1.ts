/* eslint-disable prettier/prettier */
import { helper } from '@ember/component/helper';
import DOMPurify from 'dompurify';

export default helper(function sanitizeHtml([html]: [string]): string {
  if (typeof html !== 'string') {
    console.error('sanitize-html helper received non-string content:', html);
    return '';
  }

  console.log("Content data in helper");
  console.log(html);
  console.log("Content data in helper");

  const sanitizedHtml = DOMPurify.sanitize(html);
  return sanitizedHtml;
});
