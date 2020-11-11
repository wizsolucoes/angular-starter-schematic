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
} from "@angular-devkit/schematics";

import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";

import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from "@schematics/angular/utility/dependencies";

import { Schema } from "./schema";
import { buildDefaultPath } from "@schematics/angular/utility/project";

import { dependencies, devDependencies } from "../dependencies";

export function main(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      addScripts(),
      addHuskyHook(),
      addDependencies(),
      generateProjectFiles(_options),
      createStagingEnvironment(),
    ])(tree, _context);
  };
}

function generateProjectFiles(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const defaultProjectPath = _getDefaultProjectPath(tree);
    const projectPath = defaultProjectPath.replace("src/app", "");

    const sourceTemplates = url("./files");

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

function addScripts(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJsonBuffer = tree.read("package.json");

    if (!packageJsonBuffer) {
      throw new SchematicsException("No package.json file found");
    }

    const packageJsonObject = JSON.parse(packageJsonBuffer.toString());
    const scripts = packageJsonObject.scripts;
    scripts["server"] = "json-server --watch server/db.json";

    tree.overwrite("package.json", JSON.stringify(packageJsonObject, null, 2));

    return tree;
  };
}

function addHuskyHook(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJsonBuffer = tree.read("package.json");

    if (!packageJsonBuffer) {
      throw new SchematicsException("No package.json file found");
    }

    const packageJsonObject = JSON.parse(packageJsonBuffer.toString());

    packageJsonObject["husky"] = {
      hooks: {
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      },
    };

    tree.overwrite("package.json", JSON.stringify(packageJsonObject, null, 2));

    return tree;
  };
}

function createStagingEnvironment(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const defaultProjectPath = _getDefaultProjectPath(tree);
    return chain([
      _createStagingEnvironmentFile(defaultProjectPath),
      _createStagingEnvironmentConfig(),
    ])(tree, _context);
  };
}

function _createStagingEnvironmentFile(defaultProjectPath: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const environmentFilePath = defaultProjectPath.replace(
      "/app",
      "/environments/environment.ts"
    );

    const environmentFileContent = tree.read(environmentFilePath)!.toString();

    const stagingEnvFilePath = environmentFilePath.replace(
      "environment.ts",
      "environment.staging.ts"
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
    const e2eConfigs = projectArchitect.e2e.configurations;

    const stagingEnvironmentBuildConfig = _copyObject(buildConfigs.production);
    const stagingEnvironmentServeConfig = _copyObject(serveConfigs.production);
    const stagingEnvironmentE2eConfig = _copyObject(e2eConfigs.production);

    stagingEnvironmentBuildConfig.fileReplacements.forEach(
      (replacement: { [key: string]: string }) => {
        if (replacement.with) {
          replacement.with = replacement.with.replace("prod", "staging");
        }
      }
    );

    stagingEnvironmentServeConfig.browserTarget = stagingEnvironmentServeConfig.browserTarget.replace(
      "production",
      "staging"
    );

    stagingEnvironmentE2eConfig.devServerTarget = stagingEnvironmentE2eConfig.devServerTarget.replace(
      "production",
      "staging"
    );

    buildConfigs["staging"] = stagingEnvironmentBuildConfig;
    serveConfigs["staging"] = stagingEnvironmentServeConfig;
    e2eConfigs["staging"] = stagingEnvironmentE2eConfig;

    tree.overwrite("angular.json", JSON.stringify(workspaceConfig, null, 2));

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

function _getDefaultProjectPath(tree: Tree) {
  const workspaceConfig = _getWorkspaceConfig(tree);
  const projectName: string = workspaceConfig.defaultProject;
  const project = workspaceConfig.projects[projectName];

  const defaultProjectPath = buildDefaultPath(project);

  return defaultProjectPath;
}

function _getWorkspaceConfig(tree: Tree): { [key: string]: any } {
  const workspaceConfigBuffer = tree.read("angular.json");
  return JSON.parse(workspaceConfigBuffer!.toString());
}

function _copyObject(obj: { [key: string]: any }): { [key: string]: any } {
  return JSON.parse(JSON.stringify(obj));
}
