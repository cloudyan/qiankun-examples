import * as pathToRegexp from 'path-to-regexp';

function toArray<T>(source: T | T[]): T[] {
  return Array.isArray(source) ? source : [source];
}

export function isAppActive(
  location: any,
  history: string,
  opts: any,
) {
  const { base, setMatchedBase } = opts;
  const baseConfig = toArray(base);

  switch (history) {
    case 'hash': {
      const matchedBase = baseConfig.find(pathPrefix =>
        testPathWithPrefix(`#${pathPrefix}`, location.hash),
      );
      if (matchedBase) {
        setMatchedBase(matchedBase);
      }

      return !!matchedBase;
    }

    case 'browser': {
      const matchedBase = baseConfig.find(pathPrefix =>
        testPathWithPrefix(pathPrefix, location.pathname),
      );
      if (matchedBase) {
        setMatchedBase(matchedBase);
      }

      return !!matchedBase;
    }

    default:
      return false;
  }
}

function testPathWithPrefix(pathPrefix: string, realPath: string) {
  return (
    testPathWithStaticPrefix(pathPrefix, realPath) ||
    testPathWithDynamicRoute(pathPrefix, realPath)
  );
}
function testPathWithStaticPrefix(pathPrefix: string, realPath: string) {
  if (pathPrefix.endsWith('/')) {
    return realPath.startsWith(pathPrefix);
  }

  const pathRegex = new RegExp(`^${pathPrefix}(\\/|\\?)+.*$`, 'g');
  const normalizedPath = `${realPath}/`;
  return pathRegex.test(normalizedPath);
}

function testPathWithDynamicRoute(dynamicRoute: string, realPath: string) {
  return !!pathToRegexp(dynamicRoute, { strict: true, end: false }).exec(
    realPath,
  );
}
