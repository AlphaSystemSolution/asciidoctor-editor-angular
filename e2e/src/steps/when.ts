/// <reference path="../../../typings/index.d.ts"/>

import { StepDefinitions } from 'cucumber';
import pause from '../support/action/pause';

module.exports = function when() {
    let step: StepDefinitions = this;
    step.When(/^I pause for (\d+)ms$/, pause);
};
