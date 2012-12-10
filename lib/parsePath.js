
module.exports = function (path, keys, opts) {
  keys = keys || [];
  opts = opts || {};
  var re = /(\.)?:(\w+)(\?)?/g;

  path = path
    .split(/\//g)
    .map(function (chunk) {
      return chunk.replace(re, function (_, ext, key, optional) {
        if (key) keys.push({ key: key, optional: !! optional });
        return ext
          ? '(?:\.([^/.]+?))' + (optional || '')
          : '(?:([^/]+?))' + (optional || '');
      });
    })
    .join('/')
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');

  return new RegExp('^' + path + '$', 'i')
};
