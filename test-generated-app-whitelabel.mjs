#!/usr/bin/env zx

let version = await $`node -p "require('./package.json').version"`;

await $`npm install`;
await $`npm run build`;
$`npm pack`;

cd('..');

await $`ng new schematics-whitelabel-test-app --style=scss --strict=false`;
cd('../schematics-whitelabel-test-app');

await $`npm i --no-save ${__dirname}/wizsolucoes-angular-starter-${version}.tgz`;
await $`ng g @wizsolucoes/angular-starter:ng-add --white-label=true`;

await $`prettier **/*.{html,ts,json,scss} --write`;

await $`ng test --no-watch --code-coverage --browsers=ChromeHeadless`;

await $`ng lint`;

cd('..');
await $`rm -r schematics-whitelabel-test-app`;
