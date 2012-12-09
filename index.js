module.exports = process.env.parsePath_COV
  ? require('./lib-cov/parsePath')
  : require('./lib/parsePath');
