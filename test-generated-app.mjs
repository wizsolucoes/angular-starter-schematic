#!/usr/bin/env zx

let version = await $`node -p "require('./package.json').version"`;

await $`npm install`;
await $`npm run build`;
await $`npm pack`;

cd('..');

await $`ng new schematics-test-app --style=scss`;
cd('schematics-test-app');

await $`npm i --no-save ${__dirname}/wizsolucoes-angular-starter-${version}.tgz`;
await $`ng g @wizsolucoes/angular-starter:ng-add --white-label=$WHITE_LABEL`;

await $`npm run test:ci`;
await $`ng lint`;

cd('..');
await $`rm -r schematics-test-app`;
