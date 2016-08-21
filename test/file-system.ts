/// <reference path="../typings/index.d.ts" />

import * as fs from 'fs';

const env = process.env;

const files: string[] = fs.readdirSync(env['HOMEPATH']);

for (var index in files) {
    console.log("FILE: %s", files[index]);
}
