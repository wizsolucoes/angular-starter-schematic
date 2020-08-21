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
      addBulmaCSS(_options),
      generateProjectFiles(_options),
    ])(tree, _context);
  };
}

export function generateProjectFiles(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read("angular.json");

    if (!workspaceConfigBuffer) {
      throw new SchematicsException("Not an Angular CLI workspace");
    }

    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const projectName = _options.project || workspaceConfig.defaultProject;
    const project = workspaceConfig.projects[projectName];

    const defaultProjectPath = buildDefaultPath(project);
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

function addBulmaCSS(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read("angular.json");

    if (!workspaceConfigBuffer) {
      throw new SchematicsException("No angular.json file found");
    }

    const workspaceConfigObject = JSON.parse(workspaceConfigBuffer.toString());
    const projectName =
      _options.project || workspaceConfigObject.defaultProject;
    workspaceConfigObject.projects[
      projectName
    ].architect.build.options.styles.splice(
      0,
      0,
      "node_modules/bulma/css/bulma.min.css"
    );

    tree.overwrite(
      "angular.json",
      JSON.stringify(workspaceConfigObject, null, 2)
    );

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

export function _overwriteIfExists(host: Tree): Rule {
  return forEach((fileEntry) => {
    if (host.exists(fileEntry.path)) {
      host.overwrite(fileEntry.path, fileEntry.content);
      return null;
    }
    return fileEntry;
  });
}
