/// <reference path="../../../../typings/index.d.ts"/>

import { CallbackStepDefinition } from 'cucumber';

export default (type: string, page: string, done: CallbackStepDefinition) => {
    let url: string = (type === 'url') ? page : browser.options.baseUrl + page;
    browser.windowHandleMaximize().url(url);
    done();
};
