/*!
 * Storage
 */

var tests = [];

/*!
 * Testable constructor
 */

function Testable (path) {
  this.test = { path: path };
  this.test.keys = [];
  this.test.pass = [];
  this.test.fail = [];
  tests.push(this.test);
}

Testable.prototype.key = function (key, optional) {
  if (arguments.length === 1) optional = false;
  this.test.keys.push({ key: key, optional: optional });
  return this;
};

Testable.prototype.pass = function (path) {
  var keys = [].slice.call(arguments, 1);
  this.test.pass.push({ path: path, keys: keys });
  return this;
};

Testable.prototype.fail = function (path) {
  this.test.fail.push(path);
  return this;
};

function path (p) {
  return new Testable(p);
}

/*!
 * Tests
 */

path('/')
  .pass('/')
  .fail('/home')

path('/home')
  .pass('/home')
  .fail('/')
  .fail('/root')
  .fail('/home/2')

path('*')
  .pass('/')
  .pass('/home')
  .pass('/blog')
  .pass('/image.png')
  .pass('/images/image.jpg');

path('/home/*/users')
  .pass('/home/blog/1/users')
  .pass('/home/something/users')
  .fail('/home/users/view')
  .fail('/home/users');

path('/:page')
  .key('page')
  .pass('/home', 'home')
  .pass('/blog', 'blog')
  .pass('/page', 'page')
  .fail('/')
  .fail('/page/2');

path('/:page.:format')
  .key('page')
  .key('format')
  .pass('/home.html', 'home', 'html')
  .pass('/page.json', 'page', 'json')
  .fail('/')
  .fail('/page')
  .fail('/page/2.json');

path('/:page.:format?')
  .key('page')
  .key('format', true)
  .pass('/home.html', 'home', 'html')
  .pass('/page.json', 'page', 'json')
  .pass('/blog', 'blog')
  .fail('/')
  .fail('/page/2.json');

path('/blog/:blog/comment/:comment')
  .key('blog')
  .key('comment')
  .pass('/blog/my-blog/comment/123', 'my-blog', '123')
  .fail('/blog/comment/123');

/*!
 * Bootstrap
 */

tests.forEach(function (line) {

  describe(line.path, function () {
    it('keys (' + line.keys.length + ')', function () {
      var keys = []
        , parsed = parsePath(line.path, keys);
      keys.should.deep.equal(line.keys);
    });

    line.pass.forEach(function (pass, which) {
      it('[+] ' + pass.path, function () {
        var parsed = parsePath(line.path)
          , m = pass.path.match(parsed)
          , i = 1
          , res;

        chai.expect(m, 'path match').to.exist;

        // if no keys were expect, then we're done here
        if (!line.keys.length) return;

        for (; i < m.length; i++) {
          res = line.pass[which].keys;
          if (!res[i - 1]) should.equal(m[i], undefined);
          else m[i].should.equal(res[i - 1]);
        }
      });
    });

    line.fail.forEach(function (fail) {
      it('[-] ' + fail, function () {
        var parsed = parsePath(line.path)
          , m = fail.match(parsed);
        should.not.exist(m);
      });
    });
  });

});
