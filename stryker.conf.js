// This config was generated using a preset.
// Please see the handbook for more information: https://github.com/stryker-mutator/stryker-handbook/blob/master/stryker/guides/angular.md#angular
// projects\micro-app\src\app\components\calculator\calculator.component.spec.ts
module.exports = function (config) {
  config.set({
    mutate: [
      "src/**/*.ts",
      "!src/**/*.spec.ts",
      "!src/main.ts",
      "!src/test.ts",
    ],
    mutator: {
      name: 'typescript',
      excludedMutations:
        [
          // 'EqualityOperator',
          // 'LogicalOperator',
          // 'BooleanLiteral',
          'StringLiteral',
          // 'ArrayLiteral',
          // 'ObjectLiteral',
          // 'ConditionalExpression',
          // 'BinaryExpression',
          // 'PrefixUnaryExpression',
          // 'MethodExpression',
          // 'Block',
          // 'ArrowFunction',
          // 'BooleanSubstitution',
          // 'IfStatement'          
        ]
    },
    testRunner: "karma",
    karma: {
      configFile: "./karma.conf.js",
      projectType: "angular-cli",
      config: {
        browsers: ["ChromeHeadless"]
      }
    },
    reporters: ["progress", "clear-text", "html"],
    maxConcurrentTestRunners: 4, // Recommended to use about half of your available cores when running stryker with angular.
    coverageAnalysis: "off"
  });
};
