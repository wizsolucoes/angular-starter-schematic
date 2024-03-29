import {
  apply,
  chain,
  externalSchematic,
  forEach,
  MergeStrategy,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
} from '@angular-devkit/schematics';

import { parse, stringify } from 'comment-json';

import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';

import { createDefaultPath } from '@schematics/angular/utility/workspace';
import { Schema } from './schema';

import { dependencies, devDependencies } from '../dependencies';

let defaultPath: string;

const SUPORTED_MAJOR_ANGULAR_VERSION = '15';

export function main(_options: Schema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read('angular.json');

    if (!workspaceConfigBuffer) {
      throw new SchematicsException('Not an Angular CLI workspace');
    }

    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const projectName = _options.project || workspaceConfig.defaultProject;

    defaultPath = await createDefaultPath(tree, projectName);

    return chain([
      validateAngularVersion(),
      addScripts(),
      addHuskyHooks(),
      addDependencies(),
      generateProjectFiles(),
      _options['white-label'] ? generateWhiteLabelProjectFiles() : noop(),
      createStagingEnvironment(),
      configureTSLint(),
      addESLint(),
      configureTSConfigJSON(),
      configureESLintrcJsonFile(),
      addCodeCoverageExclude(),
      updateTsConfigSpec(),
      upsertVSCodeRecommendations(),
    ]);
  };
}

function generateProjectFiles(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const projectPath = defaultPath.replace('src/app', '');

    const sourceTemplates = url('./files');

    const sourceParameterizedTemplates = apply(sourceTemplates, [
      move(projectPath),
      _overwriteIfExists(tree),
    ]);

    return mergeWith(sourceParameterizedTemplates, MergeStrategy.Overwrite)(
      tree,
      _context
    );
  };
}

function generateWhiteLabelProjectFiles(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.delete(`${defaultPath}/core/interceptors/default.interceptor.ts`);
    tree.delete(`${defaultPath}/core/interceptors/default.interceptor.spec.ts`);

    const projectPath = defaultPath.replace('src/app', '');

    const sourceTemplates = url('./files-white-label');

    const sourceParamatrizedTemplates = apply(sourceTemplates, [
      move(projectPath),
      _overwriteIfExists(tree),
    ]);

    return mergeWith(sourceParamatrizedTemplates, MergeStrategy.Overwrite)(
      tree,
      _context
    );
  };
}

function addDependencies(): Rule {
  return (host: Tree, _context: SchematicContext) => {
    for (let pkg in dependencies) {
      const nodeDependency: NodeDependency = _nodeDependencyFactory(
        pkg,
        dependencies[pkg],
        NodeDependencyType.Default
      );

      addPackageJsonDependency(host, nodeDependency);
    }

    for (let pkg in devDependencies) {
      const nodeDependency: NodeDependency = _nodeDependencyFactory(
        pkg,
        devDependencies[pkg],
        NodeDependencyType.Dev
      );

      addPackageJsonDependency(host, nodeDependency);
    }

    _context.addTask(new NodePackageInstallTask());
  };
}

function configureTSConfigJSON(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const tsconfigJsonBuffer = tree.read('tsconfig.json');

    if (!tsconfigJsonBuffer) {
      throw new SchematicsException('No tsconfig.json file found');
    }

    const tsconfigJsonObject: any = parse(tsconfigJsonBuffer.toString());
    const compilerOptions: any = tsconfigJsonObject.compilerOptions;

    compilerOptions['resolveJsonModule'] = true;
    compilerOptions['allowSyntheticDefaultImports'] = true;

    tree.overwrite('tsconfig.json', stringify(tsconfigJsonObject, null, 2));

    return tree;
  };
}

function configureTSLint(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const fileName = 'tslint.json';
    const tsLintConfigBuffer = tree.read(fileName);

    if (tsLintConfigBuffer) {
      const tsLintConfig = JSON.parse(tsLintConfigBuffer.toString());
      tsLintConfig.extends = ['tslint:recommended', 'tslint-config-prettier'];
      tree.overwrite(fileName, JSON.stringify(tsLintConfig, null, 2));
    }
  };
}

function addESLint(): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return externalSchematic('@angular-eslint/schematics', 'ng-add', {});
  };
}

function addScripts(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJsonBuffer = tree.read('package.json');

    if (!packageJsonBuffer) {
      throw new SchematicsException('No package.json file found');
    }

    const packageJsonObject = JSON.parse(packageJsonBuffer.toString());
    const scripts = packageJsonObject.scripts;

    scripts['server'] = 'json-server --watch server/db.json';
    scripts['format:check'] = 'prettier **/*.{html,ts,js,json,scss} --check';
    scripts['format:write'] = 'prettier **/*.{html,ts,js,json,scss} --write';
    scripts['test:ci'] =
      'ng test --watch=false --code-coverage --browsers=ChromeHeadless';
    scripts['test:coverage'] =
      'ng test --code-coverage --browsers=ChromeHeadless';

    tree.overwrite('package.json', JSON.stringify(packageJsonObject, null, 2));

    return tree;
  };
}

function configureESLintrcJsonFile(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const esLintJsonBuffer = tree.read('.eslintrc.json');

    if (esLintJsonBuffer) {
      const esLintJsonObject = JSON.parse(esLintJsonBuffer.toString());
      const overrides = esLintJsonObject.overrides;
      const tsOverride = overrides.find(
        (it: any) => it.files && it.files.indexOf('*.ts') > -1
      );
      const htmlOverride = overrides.find(
        (it: any) => it.files && it.files.indexOf('*.html') > -1
      );

      tsOverride.extends.push(
        'plugin:@angular-eslint/template/process-inline-templates'
      );
      tsOverride.extends.push('prettier');
      tsOverride.extends.push('plugin:prettier/recommended');
      htmlOverride.extends.push('prettier');

      tree.overwrite(
        '.eslintrc.json',
        JSON.stringify(esLintJsonObject, null, 2)
      );

      return tree;
    }
  };
}

function addHuskyHooks(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJsonBuffer = tree.read('package.json');

    if (!packageJsonBuffer) {
      throw new SchematicsException('No package.json file found');
    }

    const packageJsonObject = JSON.parse(packageJsonBuffer.toString());

    packageJsonObject['husky'] = {
      hooks: {
        'pre-commit': 'lint-staged',
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
      },
    };

    packageJsonObject['lint-staged'] = {
      '*.{js,ts,tsx}': ['eslint'],
    };

    tree.overwrite('package.json', JSON.stringify(packageJsonObject, null, 2));

    return tree;
  };
}

function createStagingEnvironment(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    console.log('Creating staging environment');
    return chain([
      _createStagingEnvironmentFile(defaultPath),
      _createStagingEnvironmentConfig(),
    ])(tree, _context);
  };
}

function addCodeCoverageExclude(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfig = _getWorkspaceConfig(tree);
    const projectName: string = workspaceConfig.defaultProject;
    const projectArchitect = workspaceConfig.projects[projectName].architect;

    const testOptions = projectArchitect.test.options;

    testOptions['codeCoverageExclude'] = ['**/*.module.ts'];

    tree.overwrite('angular.json', JSON.stringify(workspaceConfig, null, 2));

    return tree;
  };
}

function updateTsConfigSpec(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const tsConfigSpecBuffer = tree.read('tsconfig.spec.json');

    if (!tsConfigSpecBuffer) {
      console.warn('tsconfig.spec.json not found');
      return tree;
    }

    const tsConfigSpec: any = parse(tsConfigSpecBuffer.toString());

    tsConfigSpec.include.unshift('**/*.ts');

    tree.overwrite('tsconfig.spec.json', stringify(tsConfigSpec, null, 2));

    return tree;
  };
}

function validateAngularVersion(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJsonBuffer = tree.read('package.json');

    if (!packageJsonBuffer) {
      throw new SchematicsException('No package.json file found');
    }

    const packageJsonObject = JSON.parse(packageJsonBuffer.toString());
    const packageDependencies = packageJsonObject.dependencies;

    const angularVersionString = packageDependencies['@angular/core'];

    var majorVersionRegexp = /^[~\^]*(?<major>\d+)\./;
    var match = majorVersionRegexp.exec(angularVersionString);

    if (!match || !match.groups) {
      throw new SchematicsException(
        'No @angular/core version found in package.json. Are you sure this is an Angular workspace?'
      );
    }

    const angularMajorVersion = match.groups.major;

    if (angularMajorVersion != SUPORTED_MAJOR_ANGULAR_VERSION) {
      throw new SchematicsException(
        `
        ❌ @wizsolucoes/angular-starter detected Angular version ${angularMajorVersion}.
        This Schematic must be run on an Angular application version ${SUPORTED_MAJOR_ANGULAR_VERSION}.
        `
      );
    }

    console.log(
      `✅ @wizsolucoes/angular-starter detected Angular version ${angularMajorVersion}.`
    );

    return tree;
  };
}

function upsertVSCodeRecommendations(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const filePath = '.vscode/extensions.json';
    const ourRecommendations = ['WizSolucoes.devz-front-end-pack'];

    const extensionsJSONBuffer = tree.read(filePath);

    if (!extensionsJSONBuffer) {
      console.log('VS Code Extensions file not found. Creating a new file.');

      tree.create(
        filePath,
        stringify({ recommendations: ourRecommendations }, null, 2)
      );

      return tree;
    }

    const extensionsJSON: any = parse(extensionsJSONBuffer.toString());

    const originalRecomendations: any = extensionsJSON.recommendations || [];

    const set = new Set([...ourRecommendations, ...originalRecomendations]);

    extensionsJSON.recommendations = Array.from(set);

    tree.overwrite(filePath, stringify(extensionsJSON, null, 2));

    return tree;
  };
}

function _createStagingEnvironmentFile(defaultProjectPath: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const environmentFilePath = defaultProjectPath.replace(
      '/app',
      '/environments/environment.ts'
    );

    const environmentFileContent = tree.read(environmentFilePath)!.toString();

    const stagingEnvFilePath = environmentFilePath.replace(
      'environment.ts',
      'environment.staging.ts'
    );

    tree.create(stagingEnvFilePath, environmentFileContent);

    return tree;
  };
}

function _createStagingEnvironmentConfig(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfig = _getWorkspaceConfig(tree);
    const projectName: string = workspaceConfig.defaultProject;
    const projectArchitect = workspaceConfig.projects[projectName].architect;

    const buildConfigs = projectArchitect.build.configurations;
    const serveConfigs = projectArchitect.serve.configurations;

    const stagingEnvironmentBuildConfig = _copyObject(buildConfigs.production);
    const stagingEnvironmentServeConfig = _copyObject(serveConfigs.production);

    stagingEnvironmentServeConfig.browserTarget =
      stagingEnvironmentServeConfig.browserTarget.replace(
        'production',
        'staging'
      );

    buildConfigs['staging'] = stagingEnvironmentBuildConfig;
    serveConfigs['staging'] = stagingEnvironmentServeConfig;

    tree.overwrite('angular.json', JSON.stringify(workspaceConfig, null, 2));

    return tree;
  };
}

function _nodeDependencyFactory(
  packageName: string,
  version: string,
  type: NodeDependencyType
): NodeDependency {
  return {
    type: type,
    name: packageName,
    version: version,
    overwrite: true,
  };
}

function _overwriteIfExists(host: Tree): Rule {
  return forEach((fileEntry) => {
    if (host.exists(fileEntry.path)) {
      host.overwrite(fileEntry.path, fileEntry.content);
      return null;
    }
    return fileEntry;
  });
}

function _getWorkspaceConfig(tree: Tree): { [key: string]: any } {
  const workspaceConfigBuffer = tree.read('angular.json');
  return JSON.parse(workspaceConfigBuffer!.toString());
}

function _copyObject(obj: { [key: string]: any }): { [key: string]: any } {
  return JSON.parse(JSON.stringify(obj));
}
