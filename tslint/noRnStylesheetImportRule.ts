// tslint:disable:max-classes-per-file

import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "react-native-auto-stylesheet is preferred over React Native's StyleSheet";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    const text = node.getText();

    if (/StyleSheet[^\w].*'react-native'/.test(text)) {
      let replacement = text.replace(/StyleSheet[\ ,]?/g, '') + '\n';
      if (/\{\s*}/.test(replacement)) {
        replacement = '';
      }
      replacement += "import { StyleSheet } from 'react-native-auto-stylesheet';";

      const fix = new Lint.Replacement(node.getStart(), node.getWidth(), replacement);
      this.addFailureAtNode(node, Rule.FAILURE_STRING, fix);
    }

    super.visitImportDeclaration(node);
  }
}
