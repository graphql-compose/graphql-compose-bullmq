export function normalizePrefixGlob(prefixGlob: string): string {
  let prefixGlobNorm = prefixGlob;
  const nameCase = prefixGlobNorm.split(':');
  if (nameCase.length >= 3) {
    prefixGlobNorm = nameCase.filter((s) => s !== '').join(':') + ':';
  } else if (nameCase.length === 2) {
    prefixGlobNorm += prefixGlobNorm.endsWith(':') ? '*:' : ':';
  } else {
    prefixGlobNorm += ':*:';
  }
  prefixGlobNorm += 'meta';

  return prefixGlobNorm;
}
