#!/usr/bin/env zx

let version = await $`node -p "require('./package.json').version"`;

await $`rm -rf ../schematics-test-app`;

await $`npm config set legacy-peer-deps true`;
await $`npm install`;
await $`npm run build`;
await $`npm pack`;

cd('..');

await $`ng new schematics-test-app --style=scss`;
cd('schematics-test-app');

await $`npm i --no-save ${__dirname}/wizsolucoes-angular-starter-${version}.tgz`;
await $`ng g @wizsolucoes/angular-starter:ng-add`;

await $`npm run test:ci`;
await $`ng lint`;

cd('../');
await $`rm -rf schematics-test-app`;
