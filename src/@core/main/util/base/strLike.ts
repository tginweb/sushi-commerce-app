export default function strLike(source: any, search: any) {
  if (typeof search !== 'string' || source === null) {return false; }
  // Remove special chars
  search = search.replace(new RegExp("([\\.\\\\\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:\\-])", "g"), "\\$1");
  // Replace % and _ with equivalent regex
  search = search.replace(/%/g, '.*').replace(/_/g, '.');
  // Check matches
  return RegExp('^' + search + '$', 'gi').test(source);
}
