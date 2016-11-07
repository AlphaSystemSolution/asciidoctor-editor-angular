/// <reference path="../../../typings/index.d.ts"/>

import { Config } from 'webdriverio';

export var config: Config = <Config>{
  specs: [
    '../../features/**/*.feature'
  ],
  capabilities: [
    {
      browserName: 'chrome'
    }
  ],
  sync: true,
  logLevel: 'error',
  coloredLogs: true,
  screenshotPath: '../errorShots/',
  baseUrl: 'http://localhost:3000',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['selenium-standalone'],
  reporters: ['spec', 'allure'],
  reporterOptions: {
    allure: {
      outputDir: '../allure-results'
    }
  },
  framework: 'cucumber',
  cucumberOpts: {
    require: [
      '../steps/given.js',
      '../steps/then.js',
      '../steps/when.js'
    ],        // <string[]> (file/dir) require files before executing features
    backtrace: false,   // <boolean> show full backtrace for errors
    compiler: [
      'js:babel-register'
    ],
    // <string[]> ("extension:module") require files with the given EXTENSION after
    // requiring MODULE (repeatable)
    dryRun: false,      // <boolean> invoke formatters without executing steps
    failFast: false,    // <boolean> abort the run on first failure
    format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally
    // supply PATH to redirect formatter output (repeatable)
    colors: true,       // <boolean> disable colors in formatter output
    snippets: true,     // <boolean> hide step definition snippets for pending steps
    source: true,       // <boolean> hide source uris
    profile: [],        // <string[]> (name) specify the profile to use
    strict: false,      // <boolean> fail if there are any undefined or pending steps
    // tags: require('./test/tagProcessor'),
    // <string[]> (expression) only execute the features or scenarios with
    // tags matching the expression
    timeout: 20000,     // <number> timeout for step definitions
    ignoreUndefinedDefinitions: false
    // <boolean> Enable this config to treat undefined definitions as warnings.
  },
  before: function () {
    /**
     * Setup the Chai assertion framework
     */
    let chai = require('chai');

    // global.expect = chai.expect;
    // global.assert = chai.assert;
    global.should = chai.should();
  }
};
