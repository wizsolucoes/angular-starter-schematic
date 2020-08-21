import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic,
} from "@angular-devkit/schematics";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([schematic("starter", _options)])(tree, _context);
  };
}
