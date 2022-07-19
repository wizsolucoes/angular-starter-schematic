import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

let appTree: UnitTestTree;
  const schematicRunner = new SchematicTestRunner(
    'schematics',
    path.join(__dirname, './../collection.json'),
  )

  const nameProject = 'my-app';

  const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '14.0.0',
  }

  const appOptions = {
    name: nameProject,
    inlineTemplate: false,
    routing: false,
    skipTests: false,
    skipPackageJson: false,
  }




describe('starter', () => {
  
  beforeEach(async () => {
    appTree = await schematicRunner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise()
    appTree = await schematicRunner.runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree).toPromise()
  })

  it('works', async () => {
    expect(appTree.files).toContain('/projects/' + nameProject + '/src/app/app.module.ts');
  });

  beforeEach(async () => {
    await schematicRunner.runSchematicAsync('ng-add', { }, appTree).toPromise()
  })

  ////////////////
  //// Prettier
  ////////////////
  it('Prettier: adds scripts to package.json', async () => {
    const packageJsonBuffer = appTree.read('package.json');
    const packageJsonObject = JSON.parse(packageJsonBuffer!!.toString());
    expect(packageJsonObject.scripts).toEqual(
      jasmine.objectContaining({
        'format:check': 'prettier **/*.{html,ts,js,json,scss} --check',
        'format:write': 'prettier **/*.{html,ts,js,json,scss} --write',
      })
    );
  });

  it('Prettier: modifies tslint.json extends property', () => {
    const tsLintBuffer = appTree.read('tslint.json');

    if (tsLintBuffer) {
      const tsLintObject = JSON.parse(tsLintBuffer.toString());
      expect(tsLintObject.extends).toEqual([
        'tslint:recommended',
        'tslint-config-prettier',
      ]);
      return;
    }
    expect(true).toBeTruthy();
  });

  it('Prettier: adds configuration files', () => {
    expect(appTree.files).toEqual(
      jasmine.arrayContaining([
        '/projects/' + nameProject + '/.prettierrc',
        '/projects/' + nameProject + '/.prettierignore',
      ])
    );
  });

  ////////////////
  //// Commit lint
  ////////////////
  it('commit lint: adds commitlint.config.js file', async () => {
    expect(appTree.files).toContain( '/projects/' + nameProject + '/commitlint.config.js');
  });


  ////////////////
  //// Git hooks
  ////////////////
  it('git hooks:adds husky object', async () => {
    const packageJsonBuffer = appTree.read('package.json');
    const packageJsonObject = JSON.parse(packageJsonBuffer!!.toString());
    expect(packageJsonObject).toEqual(
      jasmine.objectContaining({
        husky: {
          hooks: {
            'pre-commit': 'lint-staged',
            'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
          },
        },
      })
    );
  });

  ////////////////
  //// Lint Stage
  ////////////////
  it('adds lint-staged object', async () => {
    const packageJsonBuffer = appTree.read('package.json');
    const packageJsonObject = JSON.parse(packageJsonBuffer!!.toString());

    expect(packageJsonObject).toEqual(
      jasmine.objectContaining({
        "lint-staged": {
          "*.{js,ts,tsx}": [
            "eslint"
          ]
        }
      })
    );
  });
  
  it('creates staging environment file', () => {
    expect(appTree.files).toContain(
      '/projects/' + nameProject + '/src/environments/environment.staging.ts'
    );
  });

  it('adds staging configurations to angular.json', () => {
    const workspaceConfigBuffer = appTree.read('angular.json');
    const workspaceConfig = JSON.parse(workspaceConfigBuffer!.toString());
    const projectName: string = workspaceConfig.defaultProject;

    
    expect(workspaceConfig.projects[nameProject].architect.build.configurations.staging).toBeDefined();
    expect(projectName).toBe(nameProject);
    
    const projectArchitect = workspaceConfig.projects[projectName].architect;

    const serveConfigs = projectArchitect.serve.configurations;

    expect(serveConfigs).toEqual(
      jasmine.objectContaining({
        staging: {
          browserTarget: 'my-app:build:staging',
        },
      })
    );
  });
});


describe('starter no white label', () => {

  /// Reset the appTree before each test
  beforeEach(async () => {
    appTree = await schematicRunner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise()
    appTree = await schematicRunner.runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree).toPromise()
  })

  it('should not contain: tenant, configuration, theme, api responses and tsconfigs files', async () => {
    return schematicRunner.runSchematicAsync('ng-add', { }, appTree).toPromise().then(() => {
      expect(appTree.files).not.toContain( nameProject + '/tsconfig.base.json');
      expect(appTree.files).not.toContain( nameProject + '/tsconfig.json');
      expect(appTree.files).not.toContain( nameProject + '/src/testing/fakes/api-responses/get-config.json');
      expect(appTree.files).not.toContain( nameProject + '/src/app/core/interceptors/tenant.interceptor.ts');
      expect(appTree.files).not.toContain( nameProject + '/src/app/core/services/configuration/configuration.ts');
      expect(appTree.files).not.toContain( nameProject + '/src/app/core/services/theming/theming.service.ts');
    })
  });
});

describe('starter white label', () => {

  beforeEach(async () => {
    appTree = await schematicRunner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).toPromise()
    appTree = await schematicRunner.runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree).toPromise()
  })

  it('should contain: tenant, configuration, theme, api responses and tsconfigs files', async () => {
    return schematicRunner.runSchematicAsync('ng-add', { 'white-label': true }, appTree).toPromise().then(() => {
      expect(appTree.files).toContain('/projects/' + nameProject + '/src/testing/fakes/api-responses/get-config.json');
      expect(appTree.files).toContain('/projects/' + nameProject + '/src/app/core/interceptors/tenant.interceptor.ts');
      expect(appTree.files).not.toContain('/projects/' + nameProject + '/src/app/core/interceptors/default.interceptor.ts');
      expect(appTree.files).toContain('/projects/' + nameProject + '/src/app/core/services/configuration/configuration.ts');
      expect(appTree.files).toContain('/projects/' + nameProject + '/src/app/core/services/theming/theming.service.ts');
    })
  });
});