#!/usr/bin/env zx

let version = await $`node -p "require('./package.json').version"`;

await $`npm install`;
await $`npm run build`;
$`npm pack`;

cd('..');

await $`ng new schematics-whitelabel-test-app --style=scss`;
cd('../schematics-whitelabel-test-app');

await $`npm i --no-save ${__dirname}/wizsolucoes-angular-starter-${version}.tgz`;
await $`ng g @wizsolucoes/angular-starter:ng-add --white-label=true`;

await $`ng test --no-watch --code-coverage`;

await $`ng lint`;
