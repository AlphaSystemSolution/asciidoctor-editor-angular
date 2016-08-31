/// <reference path="../typings/index.d.ts" />

import * as fs from 'fs';

const env = process.env;

const files: string[] = fs.readdirSync(env['HOMEPATH']);

for (var file of files) {
    console.log("FILE: %s", file);
}
