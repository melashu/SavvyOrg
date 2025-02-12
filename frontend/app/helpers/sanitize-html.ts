/* eslint-disable prettier/prettier */
import { helper } from '@ember/component/helper';
import DOMPurify from 'dompurify';

export default helper(function sanitizeHtml([html]: [string]): string {
  if (typeof html !== 'string') {
    console.error('sanitize-html helper received non-string content:', html);
    return '';
  }


  console.log('sanitize-html data', html)

  const parts = html.split(/(<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">[\s\S]*?<\/div><\/div>)/g);
  return parts
    .map((part, index) => {
      if (/<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">[\s\S]*?<\/div><\/div>/.test(part)) {
        return `
          <div key="${index}" class="bg-gray-900 text-white rounded-lg shadow-lg p-4 overflow-x-auto font-mono border border-gray-700">
            ${DOMPurify.sanitize(part)}
          </div>
        `;
      }
      const modifiedPart = part
        .replaceAll('ql-align-center', 'text-center')
        .replaceAll('ql-align-justify', 'text-justify')
        .replaceAll('ql-align-right', 'text-right')
        .replaceAll('<a', '<a class="text-blue-500 hover:text-blue-700 underline"')
        .replaceAll('<ol>', '<ol class="list-decimal">');

      return `<div key="${index}" class="text-gray-800 leading-relaxed">${DOMPurify.sanitize(modifiedPart)}</div>`;
    })
    .join('');
});
