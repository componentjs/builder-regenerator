var fs = require('fs');
var regenerator = require('regenerator');

var re = /\bfunction\s*\*/;

module.exports = builder_regenerator;

function builder_regenerator(options) {
  return function builder_regenerator(file, done) {
    if (file.extension !== 'js') return done();
    file.read(function (err, string) {
      if (err) return done(err);
      if (re.test(string)) file.string = regenerator(string, options);
      done();
    })
  }
}

// include the runtime somewhere in your build!
builder_regenerator.runtime = fs.readFileSync(regenerator.runtime.dev, 'utf8');