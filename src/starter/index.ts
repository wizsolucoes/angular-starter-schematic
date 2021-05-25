import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  mergeWith,
  SchematicsException,
  move,
  chain,
  MergeStrategy,
  forEach,
  noop,
  externalSchematic,
} from '@angular-devkit/schematics';

import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';

import { Schema } from './schema';
import { createDefaultPath } from '@schematics/angular/utility/workspace';

import { dependencies, devDependencies } from '../dependencies';

let defaultPath: string;

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
      addScripts(),
      addHuskyHook(),
      addDependencies(),
      generateProjectFiles(_options),
      _options['white-label']
        ? generateWhiteLabelProjectFiles(_options)
        : noop(),
      createStagingEnvironment(),
      addESLint(_options),
    ]);
  };
}

function generateProjectFiles(_options: Schema): Rule {
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

function generateWhiteLabelProjectFiles(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.delete(`${defaultPath}/core/interceptors/default.interceptor.ts`);

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

function addESLint(_options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return externalSchematic('@angular-eslint/schematics', 'ng-add', _options);
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

    tree.overwrite('package.json', JSON.stringify(packageJsonObject, null, 2));

    return tree;
  };
}

function addHuskyHook(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJsonBuffer = tree.read('package.json');

    if (!packageJsonBuffer) {
      throw new SchematicsException('No package.json file found');
    }

    const packageJsonObject = JSON.parse(packageJsonBuffer.toString());

    packageJsonObject['husky'] = {
      hooks: {
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
      },
    };

    tree.overwrite('package.json', JSON.stringify(packageJsonObject, null, 2));

    return tree;
  };
}

function createStagingEnvironment(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      _createStagingEnvironmentFile(defaultPath),
      _createStagingEnvironmentConfig(),
    ])(tree, _context);
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
    console.log(workspaceConfig);
    const projectName: string = workspaceConfig.defaultProject;
    const projectArchitect = workspaceConfig.projects[projectName].architect;

    const buildConfigs = projectArchitect.build.configurations;
    const serveConfigs = projectArchitect.serve.configurations;

    const stagingEnvironmentBuildConfig = _copyObject(buildConfigs.production);
    const stagingEnvironmentServeConfig = _copyObject(serveConfigs.production);

    stagingEnvironmentBuildConfig.fileReplacements.forEach(
      (replacement: { [key: string]: string }) => {
        if (replacement.with) {
          replacement.with = replacement.with.replace('prod', 'staging');
        }
      }
    );

    stagingEnvironmentServeConfig.browserTarget = stagingEnvironmentServeConfig.browserTarget.replace(
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
