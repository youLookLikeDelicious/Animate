const webpackTestConfig = require('./webpack-config/webpack.wallaby')

module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.js',
      {
        pattern: 'src/utile/compatibility.js',
        instrument: false
      }
    ],
    filesWithNoCoverageCalculated: ['./src/utile/compatibility.js'],
    tests: [{
      pattern: 'test/test.spec.js',
      load: true
    }],

    /* postprocessor: wallaby.postprocessors.webpack({
      externals: {
        fs: 'empty',
        canvas: 'empty',
        net: 'empty',
        child_process: 'empty',
        tls: 'empty'
      },
    }), */

    testFramework: 'mocha',

    env: {
      type: 'node'
    },

    // setup: function () {
    //   // required to trigger test loading
    //   // require('jsdom-global')()
    // },
    // bootstrap: function bootstrap() {
    //   // <-- it's in the `files` list, so you may just do that
    // },
    // compiler 不能和postprocessor共用
    compilers: {
      '**/*.js': wallaby.compilers.babel({
        babelrc: true
      })
    },
    workers: {
      restart: true
    }
  }
};