"use strict";

/**
 * Rule: optimui/no-cn-object-arg
 * Disallow passing object literals to cn() where types expect strings/falsey.
 * Flags: cn({ foo: cond }) or cn(...{ a: cond }) and nested spreads like cn(className, { a: cond }).
 */

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow object maps passed to cn()",
      recommended: true,
    },
    messages: {
      noObjectArg: "Don't pass object literals to cn(). Use conditional strings instead (e.g., cond && 'class-name').",
    },
    schema: [
      {
        type: "object",
        properties: {
          functionNames: {
            type: "array",
            items: { type: "string" },
            default: ["cn"],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options?.[0] || {};
    /** @type {string[]} */
    const functionNames = options.functionNames || ["cn"]; // support aliasing if configured

    function isTargetCallee(node) {
      // Matches Identifier callee with one of functionNames: cn(...)
      if (node.type === "Identifier") {
        return functionNames.includes(node.name);
      }
      // Matches MemberExpression like utils.cn(...)? Opt-out by default
      if (node.type === "MemberExpression" && node.property.type === "Identifier") {
        return functionNames.includes(node.property.name);
      }
      return false;
    }

    function reportIfObjectArg(arg) {
      if (!arg) return;
      if (arg.type === "ObjectExpression") {
        context.report({ node: arg, messageId: "noObjectArg" });
      } else if (arg.type === "SpreadElement" && arg.argument && arg.argument.type === "ObjectExpression") {
        context.report({ node: arg, messageId: "noObjectArg" });
      }
    }

    return {
      CallExpression(node) {
        if (!isTargetCallee(node.callee)) return;
        for (const arg of node.arguments) {
          // Ignore TemplateLiteral/ConditionalExpression etc.; only block object literals
          reportIfObjectArg(arg);
        }
      },
    };
  },
};
