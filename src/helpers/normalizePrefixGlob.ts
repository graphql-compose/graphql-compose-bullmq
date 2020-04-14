export function normalizePrefixGlob(prefixGlob: string): string {
  let prefixGlobNorm = prefixGlob;
  const nameCase = prefixGlobNorm.split(':').length - 1;
  if (nameCase >= 2) {
    prefixGlobNorm = prefixGlobNorm.split(':').slice(0, 2).join(':') + ':';
  } else if (nameCase === 1) {
    prefixGlobNorm += prefixGlobNorm.endsWith(':') ? '*:' : ':';
  } else {
    prefixGlobNorm += ':*:';
  }
  prefixGlobNorm += 'meta';

  return prefixGlobNorm;
}
