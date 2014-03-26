module.exports = function(config){
  config.set({
    basePath : '../',

    files : [
      'lib/angular/angular.min.js',
      'lib/jquery/*.js',
      'lib/underscore/*.js',
      '*.js',
      'test/unit/*.js'
    ],

    exclude : [
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-script-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};
