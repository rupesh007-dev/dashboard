export function Slicestring(str, start, end) {
  if (typeof str !== 'string') return '';
  if (typeof start !== 'number' || typeof end !== 'number') return str;
  return str.slice(start - 1, end);
}
