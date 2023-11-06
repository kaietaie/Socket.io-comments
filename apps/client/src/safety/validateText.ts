export default function validateText(inputText: string): string {
    // Define the allowed tags and their corresponding closing tags
    const allowedTags: Record<string, string> = {
      a: '</a>',
      code: '</code>',
      i: '</i>',
      strong: '</strong>',
    };
  
    // Regular expression to match the allowed opening and closing tags
    const regex = new RegExp(
      `<(${Object.keys(allowedTags).join('|')})\\b[^>]*>.*?<\\/(?:${Object.values(allowedTags).join('|')})>`,
      'g'
    );
    const sanitizedText = inputText.replace(regex, '');
    const isTextValid = sanitizedText === inputText;
  
    return isTextValid ? sanitizedText : '';
  }
  
// export const validateText = {
//   ALLOWED_TAGS: ['a', 'code', 'i', 'strong'],
//     ALLOWED_ATTR: ['href', 'title'],
// }