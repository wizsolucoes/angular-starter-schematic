import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);

describe('starter', () => {
  let appTree: UnitTestTree;

  beforeAll(async () => {
    // Run ng g workspace schematic
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        { name: 'test', version: '10.0.5' },
        appTree
      )
      .toPromise();

    // Run ng g application schematic
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        { name: 'my-app', style: 'scss' },
        appTree
      )
      .toPromise();

    // Our schematic
    await runner
      .runSchematicAsync(
        'starter',
        { 'white-label': !!Math.round(Math.random()) },
        appTree
      )
      .toPromise();
  });

  it('works', async () => {
    expect(appTree.files).toContain('/my-app/src/app/app.module.ts');
  });

  describe('prettier', () => {
    it('adds scripts to package.json', () => {
      const packageJsonBuffer = appTree.read('package.json');
      const packageJsonObject = JSON.parse(packageJsonBuffer!!.toString());

      expect(packageJsonObject.scripts).toEqual(
        jasmine.objectContaining({
          'format:check': 'prettier **/*.{html,ts,js,json,scss} --check',
          'format:write': 'prettier **/*.{html,ts,js,json,scss} --write',
        })
      );
    });

    it('modifies tslint.json extends property', () => {
      const tsLintBuffer = appTree.read('tslint.json');
      const tsLintObject = JSON.parse(tsLintBuffer!!.toString());

      if (tsLintBuffer) {
        expect(tsLintObject.extends).toEqual([
          'tslint:recommended',
          'tslint-config-prettier',
        ]);
      }
      expect(true).toBeTruthy();
    });

    it('adds configuration files', () => {
      expect(appTree.files).toEqual(
        jasmine.arrayContaining([
          '/my-app/.prettierrc',
          '/my-app/.prettierignore',
        ])
      );
    });
  });

  describe('commit lint', () => {
    it('adds commitlint.config.js file', async () => {
      expect(appTree.files).toContain('/my-app/commitlint.config.js');
    });

    it('adds git hook', async () => {
      const packageJsonBuffer = appTree.read('package.json');
      const packageJsonObject = JSON.parse(packageJsonBuffer!!.toString());

      expect(packageJsonObject).toEqual(
        jasmine.objectContaining({
          husky: {
            hooks: {
              'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
            },
          },
        })
      );
    });
  });

  describe('create staging environment', () => {
    it('creates staging environment file', () => {
      expect(appTree.files).toContain(
        '/my-app/src/environments/environment.staging.ts'
      );
    });

    it('adds staging configurations to angular.json', () => {
      const workspaceConfigBuffer = appTree.read('angular.json');
      const workspaceConfig = JSON.parse(workspaceConfigBuffer!.toString());
      const projectName: string = workspaceConfig.defaultProject;
      const projectArchitect = workspaceConfig.projects[projectName].architect;

      const buildConfigs = projectArchitect.build.configurations;
      const serveConfigs = projectArchitect.serve.configurations;

      expect(buildConfigs.staging.fileReplacements).toContain(
        jasmine.objectContaining({
          replace: 'my-app/src/environments/environment.ts',
          with: 'my-app/src/environments/environment.staging.ts',
        })
      );

      expect(serveConfigs).toEqual(
        jasmine.objectContaining({
          staging: {
            browserTarget: 'my-app:build:staging',
          },
        })
      );
    });
  });
});

describe('starter no white label', () => {
  let appTree: UnitTestTree;

  beforeAll(async () => {
    // Run ng g workspace schematic
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        { name: 'test', version: '10.0.5' },
        appTree
      )
      .toPromise();

    // Run ng g application schematic
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        { name: 'my-app', style: 'scss' },
        appTree
      )
      .toPromise();

    // Our schematic
    await runner
      .runSchematicAsync('starter', { 'white-label': false }, appTree)
      .toPromise();
  });

  it('should not contain: tenant, configuration, theme, api responses and tsconfigs files', () => {
    expect(appTree.files).not.toContain('/my-app/tsconfig.base.json');
    expect(appTree.files).not.toContain('/my-app/tsconfig.json');
    expect(appTree.files).not.toContain(
      '/my-app/src/testing/fakes/api-responses/get-config.json'
    );
    expect(appTree.files).not.toContain(
      '/my-app/src/app/core/interceptors/tenant.interceptor.ts'
    );
    expect(appTree.files).not.toContain(
      '/my-app/src/app/core/services/configuration/configuration.ts'
    );
    expect(appTree.files).not.toContain(
      '/my-app/src/app/core/services/theming/theming.service.ts'
    );
  });
});

describe('starter white label', () => {
  let appTree: UnitTestTree;

  beforeAll(async () => {
    // Run ng g workspace schematic
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        { name: 'test', version: '10.0.5' },
        appTree
      )
      .toPromise();

    // Run ng g application schematic
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        { name: 'my-app', style: 'scss' },
        appTree
      )
      .toPromise();

    // Our schematic
    await runner
      .runSchematicAsync('starter', { 'white-label': true }, appTree)
      .toPromise();
  });

  it('should contain: tenant, configuration, theme, api responses and tsconfigs files', () => {
    expect(appTree.files).toContain('/my-app/tsconfig.app.json');
    expect(appTree.files).toContain('/my-app/tsconfig.json');
    expect(appTree.files).toContain('/my-app/tsconfig.spec.json');
    expect(appTree.files).toContain(
      '/my-app/src/testing/fakes/api-responses/get-config.json'
    );
    expect(appTree.files).toContain(
      '/my-app/src/app/core/interceptors/tenant.interceptor.ts'
    );
    expect(appTree.files).not.toContain(
      '/my-app/src/app/core/interceptors/default.interceptor.ts'
    );
    expect(appTree.files).toContain(
      '/my-app/src/app/core/services/configuration/configuration.ts'
    );
    expect(appTree.files).toContain(
      '/my-app/src/app/core/services/theming/theming.service.ts'
    );
  });
});
