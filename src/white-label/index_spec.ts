import {
  SchematicTestRunner,
  UnitTestTree,
} from "@angular-devkit/schematics/testing";
import * as path from "path";

const collectionPath = path.join(__dirname, "../collection.json");
const runner = new SchematicTestRunner("schematics", collectionPath);

describe("white-label", () => {
  let appTree: UnitTestTree;

  beforeAll(async () => {
    // Run ng g workspace schematic
    appTree = await runner
      .runExternalSchematicAsync(
        "@schematics/angular",
        "workspace",
        { name: "test", version: "10.0.5" },
        appTree
      )
      .toPromise();

    // Run ng g application schematic
    appTree = await runner
      .runExternalSchematicAsync(
        "@schematics/angular",
        "application",
        { name: "my-app" },
        appTree
      )
      .toPromise();

    // Our schematic
    await runner.runSchematicAsync("white-label", {}, appTree).toPromise();
  });

  it("works", async () => {
    expect(appTree.files).toContain("/my-app/src/app/app.module.ts");
  });

  describe("prettier", () => {
    it("adds scripts to package.json", () => {
      const packageJsonBuffer = appTree.read("package.json");
      const packageJsonObject = JSON.parse(packageJsonBuffer!!.toString());

      expect(packageJsonObject.scripts).toEqual(
        jasmine.objectContaining({
          "format:check": "prettier **/*.{html,ts,js,json,scss} --check",
          "format:write": "prettier **/*.{html,ts,js,json,scss} --write",
        })
      );
    });

    it("modifies tslint.json extends property", () => {
      const tsLintBuffer = appTree.read("tslint.json");
      const tsLintObject = JSON.parse(tsLintBuffer!!.toString());

      expect(tsLintObject.extends).toEqual([
        "tslint:recommended",
        "tslint-config-prettier",
      ]);
    });

    it("adds configuration files", () => {
      expect(appTree.files).toEqual(
        jasmine.arrayContaining([
          "/my-app/.prettierrc",
          "/my-app/.prettierignore",
        ])
      );
    });
  });

  describe("commit lint", () => {
    it("adds commitlint.config.js file", async () => {
      expect(appTree.files).toContain("/my-app/commitlint.config.js");
    });

    it("adds git hook", async () => {
      const packageJsonBuffer = appTree.read("package.json");
      const packageJsonObject = JSON.parse(packageJsonBuffer!!.toString());

      expect(packageJsonObject).toEqual(
        jasmine.objectContaining({
          husky: {
            hooks: {
              "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
            },
          },
        })
      );
    });
  });

  describe("create staging environment", () => {
    it("creates staging environment file", () => {
      expect(appTree.files).toContain(
        "/my-app/src/environments/environment.staging.ts"
      );
    });

    it("adds staging configurations to angular.json", () => {
      const workspaceConfigBuffer = appTree.read("angular.json");
      const workspaceConfig = JSON.parse(workspaceConfigBuffer!.toString());
      const projectName: string = workspaceConfig.defaultProject;
      const projectArchitect = workspaceConfig.projects[projectName].architect;

      const buildConfigs = projectArchitect.build.configurations;
      const serveConfigs = projectArchitect.serve.configurations;
      const e2eConfigs = projectArchitect.e2e.configurations;

      expect(buildConfigs.staging.fileReplacements).toContain(
        jasmine.objectContaining({
          replace: "my-app/src/environments/environment.ts",
          with: "my-app/src/environments/environment.staging.ts",
        })
      );

      expect(serveConfigs).toEqual(
        jasmine.objectContaining({
          staging: {
            browserTarget: "my-app:build:staging",
          },
        })
      );

      expect(e2eConfigs).toEqual(
        jasmine.objectContaining({
          staging: {
            devServerTarget: "my-app:serve:staging",
          },
        })
      );
    });
  });
});
