/// <reference path="../../../../typings/index.d.ts"/>

import { CallbackStepDefinition } from 'cucumber';

export default (ms: string, done: CallbackStepDefinition) => {
    let intMs: number = parseInt(ms, 10);
    browser.pause(intMs);
    done();
};
