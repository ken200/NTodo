module.exports = function(config){
    config.set({
    // Content/js ÇÉãÅ[ÉgÇ∆Ç∑ÇÈ
    basePath : '../',

    files: [
      'lib/jquery/*.js',
      'lib/angular/angular.js',
      'lib/angular/angular-*.js',
      'lib/underscore/*.js',
      '*.js',
      //'test/unit/*.js'
      'test/unit/taskServicesSpec.js'
    ],

    exclude: [
      'lib/angular/angular-loader.js',
      'lib/angular/angular-scenario.js',
      'lib/angular/*.min.js'
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
