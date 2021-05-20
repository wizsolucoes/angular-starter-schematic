#!/usr/bin/env zx

let version = await $`node -p "require('./package.json').version"`;

await $`npm install`;
await $`npm run build`;
$`npm pack`;

cd('..');

await $`ng new schematics-test-app --style=scss`;
cd('../schematics-test-app');

await $`npm i --no-save ${__dirname}/wizsolucoes-angular-starter-${version}.tgz`;
await $`ng g @wizsolucoes/angular-starter:ng-add --white-label=false`;

// await $`ng test --no-watch --code-coverage`;
// await $`npx ng lint`;
