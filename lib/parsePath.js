
module.exports = function (path, opts) {
  opts = opts || {};
  var keys = []
    , parsed = path
    , re = /(\.)?:(\w+)(\?)?/g;

  parsed = parsed
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

  return {
      path: path
    , keys: keys
    , regexp: new RegExp('^' + parsed + '$', 'i')
  };
};
