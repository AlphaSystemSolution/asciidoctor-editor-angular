/// <reference path="../../../typings/index.d.ts"/>

import { StepDefinitions } from 'cucumber';
import openWebsite from '../support/action/openWebsite';

module.exports = function given() {
  let step: StepDefinitions = this;
  step.Given(/^I open the (url|site) "([^"]*)?"$/, openWebsite);
};
