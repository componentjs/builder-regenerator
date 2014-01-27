var fs = require('fs');
var regenerator = require('regenerator');
var calculate = require('sse4_crc32').calculate;

var re = /\bfunction\s*\*/;

// cache hashes of strings so we don't regenerate
// the same string over and over again
// since regeneration is very slow.
// uses crc32 to hash the strings.
// if there are collisions, just restart the process.
var cache = Object.create(null);

module.exports = builder_regenerator;

function builder_regenerator(options) {
  options = options || {};

  return function builder_regenerator(file, done) {
    if (file.extension !== 'js') return done();
    file.read(function (err, string) {
      if (err) return done(err);
      if (!re.test(string)) return done();

      var crc = calculate(string);
      if (crc in cache) {
        file.string = cache[crc];
        done();
        return;
      }

      cache[crc] =
      file.string = regenerator(string, options);
      done();
    })
  }
}

// include the runtime somewhere in your build!
builder_regenerator.runtime = fs.readFileSync(regenerator.runtime.dev, 'utf8');