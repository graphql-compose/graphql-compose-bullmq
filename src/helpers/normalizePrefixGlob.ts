export function normalizePrefixGlob(prefixGlob: string): string {
  let prefixGlobNorm = prefixGlob;
  const sectionsCount = prefixGlobNorm.split(':').length - 1;

  if (sectionsCount > 1) {
    prefixGlobNorm += prefixGlobNorm.endsWith(':') ? '' : ':';
  } else if (sectionsCount == 1) {
    prefixGlobNorm += prefixGlobNorm.endsWith(':') ? '*:' : ':';
  } else {
    prefixGlobNorm += prefixGlobNorm.trim().length > 0 ? ':*:' : '*:*:';
  }

  prefixGlobNorm += 'meta';

  return prefixGlobNorm;
}
