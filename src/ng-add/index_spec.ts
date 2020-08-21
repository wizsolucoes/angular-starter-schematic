import {
  SchematicTestRunner,
  UnitTestTree,
} from "@angular-devkit/schematics/testing";
import * as path from "path";

const collectionPath = path.join(__dirname, "../collection.json");
const runner = new SchematicTestRunner("schematics", collectionPath);

let appTree: UnitTestTree;

describe("ng-add", () => {
  beforeEach(async () => {
    appTree = await runner
      .runExternalSchematicAsync("@schematics/angular", "workspace", {
        name: "test",
        version: "10.0.5",
      })
      .toPromise();

    appTree = await runner
      .runExternalSchematicAsync(
        "@schematics/angular",
        "application",
        { name: "my-app" },
        appTree
      )
      .toPromise();
  });

  it("works", async () => {
    const options = { name: "Toure" };

    const tree = await runner
      .runSchematicAsync("ng-add", options, appTree)
      .toPromise();

    expect(tree.files).toContain("/my-app/src/app/app.module.ts");
  });
});
