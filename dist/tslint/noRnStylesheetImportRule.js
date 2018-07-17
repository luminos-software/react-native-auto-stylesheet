"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    }
}
Rule.FAILURE_STRING = "react-native-auto-stylesheet is preferred over React Native's StyleSheet";
exports.Rule = Rule;
// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
    visitImportDeclaration(node) {
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
