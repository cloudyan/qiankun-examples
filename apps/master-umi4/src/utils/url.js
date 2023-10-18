/**
 * 为了解决什么问题：为URL添加参数不encode，从URL中获取参数不decode，导致当参数中包含特殊字符时不能正常解析
 * 诉求是什么：任何参数都能通过url正常的传递并解析
 * 现在解决了什么问题：提供两个API来方便的为URL设置参数，以及从URL获取参数
 * 后续还有规划吗：暂无
 */

/**
 * @author liuzida
 * @date 2021.08.11
 * @description Stringify and add/replace params to the exist url string
 * @param urlStr Initial URL string
 * @param paramObj Params in form of {key:value} style
 * @return {
 *    queryObj, // all query paramters after merged.
 *    queryString, // encode queryObj
 *    url, // final url
 *    hash // #xx
 * }
 * @example
 *    parseUrl('http://www.xx.com/?a=1', {b:2});
 *    Will return {
 *        hash: '',
 *        queryObj: {a:1,b:2},
 *        queryString: 'a=1&b=2',
 *        url: 'http://www.xx.com/?a=1&b=2'
 *    }
 *
 * 特别注意：
 * 1.带hash的url，hash前后的参数如有，都进行了提取
 * 2.如果paramObj中包含了原url中的key，则覆盖处理
 */
export function parseUrl(urlStr, paramObj = {}, options = {}) {
  if (typeof urlStr !== 'string') {
    return '';
  }

  const { fullPath, hash, queryString: oldQueryString } = destructUrl(urlStr);
  const queryObj = {};

  Object.assign(queryObj, parse(oldQueryString, options));

  // 如果传paramObj，则将paramObj追加到结果中，也可以不传
  if (typeof paramObj === 'object' && paramObj !== null) {
    Object.assign(queryObj, paramObj);
  }

  const queryString = stringify(queryObj);
  const url = fullPath + (queryString || hash ? `?${queryString}${hash}` : '');

  return {
    query: queryObj,
    queryStr: queryString,
    pathname: fullPath,
    hash,
    url,
    hashUrl: `${fullPath}${hash}?${queryString}`,
    queryObj,
    queryString,
    fullPath,
  };
}

/**
 * 解析URL字符串拆分为多段
 * fullPath + queryStrBefore + hash + queryStrAfter
 * 便于后续query参数处理
 *
 * 示例：http://www.a.com/path/?a=1#abc?b=2
 */
function destructUrl(urlString) {
  const hashIndex = urlString.indexOf('#');

  let hash = hashIndex !== -1 ? urlString.substring(hashIndex) : ''; // 提取hash
  const urlStr = hash ? urlString.substring(0, hashIndex) : urlString; // urlStr中排除掉hash
  // 此时：urlStr=http://www.a.com/path/?a=1     hash=#abc?b=2

  let queryIndex = urlStr.indexOf('?');
  const fullPath = queryIndex !== -1 ? urlStr.substring(0, queryIndex) : urlStr; // 提取host
  const queryStrBefore =
    queryIndex !== -1 ? urlStr.substring(queryIndex + 1) : ''; // 提取hash前的query

  queryIndex = hash.indexOf('?');
  const queryStrAfter = queryIndex !== -1 ? hash.substring(queryIndex + 1) : ''; // 提取hash后的query
  hash = queryIndex !== -1 ? hash.substring(0, queryIndex) : hash; // 提取排除掉hash后query的真hash

  let queryString = '';
  if (queryStrBefore && queryStrAfter) {
    queryString = `${queryStrBefore}&${queryStrAfter}`;
  } else {
    queryString = `${queryStrBefore}${queryStrAfter}`;
  }

  return {
    fullPath,
    queryStrBefore,
    hash,
    queryStrAfter,
    queryString,
  };
}

/**
 * 将对象转化为URL中经过encodeURIComponent的字符串queryString
 */
function stringify(paramObj) {
  const queryArr = [];
  for (let [key, value] of Object.entries(paramObj)) {
    // 基本类型不需要stringify，否则会转为字符串，多出一对双引号：right：a=1 wrong：a="1"
    if (typeof value !== 'undefined') {
      if (typeof value === 'object' && value !== null) {
        key = shuheEncodeURIComponent(key);
        value = shuheEncodeURIComponent(JSON.stringify(value));
      } else {
        key = shuheEncodeURIComponent(key);
        value = shuheEncodeURIComponent(value);
      }
      queryArr.push(`${key}=${value}`);
    }
  }

  return queryArr.join('&');
}

/**
 * 将URL中的queryString转化为经过decodeURIComponent处理后的键值对
 */
function parse(queryString, options) {
  if (typeof queryString !== 'string' || !queryString) {
    return {};
  }
  const result = {};
  const allKeyValuePairs = queryString.split('&');
  allKeyValuePairs.forEach((item) => {
    const [key, value] = item.split('=');
    try {
      if (!options.valueAsString) {
        // value不当成string，则强制parse
        result[decodeURIComponent(key)] = JSON.parse(decodeURIComponent(value));
      } else {
        throw new Error('');
      }
    } catch (e) {
      result[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });
  return result;
}

function shuheEncodeURIComponent(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}
