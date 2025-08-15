export default function cleanText(text: any) {
    if (!text) return '';
    return text
        .replace(/&#40;/g, '(')
        .replace(/&#41;/g, ')')
        .replace(/&quot;/g, '"')
        .replace(/&nbsp;/g, ' ')
        .replace(/[\r\n]/g, ' ')
        .replace(/<br\s*\/?>/g, ' ')
        .replace(/<h3>/g, '')
        .replace(/<\/h3>/g, '')
        .trim()
};
