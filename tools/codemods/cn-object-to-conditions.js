/**
 * Codemod to transform object-style cn() calls to conditional string arguments
 * 
 * Transforms:
 *   cn({ 'class-name': condition }) → cn(condition && 'class-name')
 *   cn({ 'class-name': true }) → cn('class-name')
 *   cn({ 'class-name': false }) → cn()
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let modified = false;

  // Helper to convert object expression to conditional arguments
  function convertObjectToConditionals(objectExpr) {
    const conditionalArgs = [];
    
    objectExpr.properties.forEach(prop => {
      // Handle both ObjectProperty and Property nodes
      const key = prop.key || prop.computed;
      const value = prop.value;
      
      // Get the class name (handle both identifiers and literals)
      let className;
      if (key.type === 'StringLiteral' || key.type === 'Literal') {
        className = key.value;
      } else if (key.type === 'TemplateLiteral') {
        // For template literals, we need to preserve them
        className = null; // We'll handle this specially
      } else if (key.type === 'Identifier') {
        className = key.name;
      } else {
        // For computed keys, skip transformation
        return;
      }

      // Handle the value
      if (value.type === 'BooleanLiteral' || (value.type === 'Literal' && typeof value.value === 'boolean')) {
        // If true, just add the class name; if false, skip it
        if (value.value === true) {
          if (className !== null) {
            conditionalArgs.push(j.stringLiteral(className));
          } else {
            conditionalArgs.push(key);
          }
        }
        // If false, we don't add anything
      } else if (value.type === 'UnaryExpression' && value.operator === '!') {
        // Handle negation: !condition
        if (className !== null) {
          conditionalArgs.push(
            j.logicalExpression(
              '&&',
              value,
              j.stringLiteral(className)
            )
          );
        } else {
          conditionalArgs.push(
            j.logicalExpression(
              '&&',
              value,
              key
            )
          );
        }
      } else {
        // For other expressions (variables, logical expressions, etc.)
        // Create: condition && 'class-name'
        if (className !== null) {
          conditionalArgs.push(
            j.logicalExpression(
              '&&',
              value,
              j.stringLiteral(className)
            )
          );
        } else {
          // For template literals as keys, preserve the structure
          conditionalArgs.push(
            j.logicalExpression(
              '&&',
              value,
              key
            )
          );
        }
      }
    });

    return conditionalArgs;
  }

  // Find all calls to cn() or utils.cn()
  root.find(j.CallExpression, {
    callee: {
      name: 'cn'
    }
  }).forEach(path => {
    const args = path.node.arguments;
    let hasObjectArg = false;
    const newArgs = [];

    args.forEach(arg => {
      if (arg.type === 'ObjectExpression') {
        hasObjectArg = true;
        const conditionalArgs = convertObjectToConditionals(arg);
        newArgs.push(...conditionalArgs);
      } else if (arg.type === 'SpreadElement' && arg.argument.type === 'ObjectExpression') {
        // Handle spread objects: cn({ ...{ a: cond } })
        hasObjectArg = true;
        const conditionalArgs = convertObjectToConditionals(arg.argument);
        newArgs.push(...conditionalArgs);
      } else {
        newArgs.push(arg);
      }
    });

    if (hasObjectArg) {
      path.node.arguments = newArgs;
      modified = true;
    }
  });

  // Also find member expressions: utils.cn()
  root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      property: {
        name: 'cn'
      }
    }
  }).forEach(path => {
    const args = path.node.arguments;
    let hasObjectArg = false;
    const newArgs = [];

    args.forEach(arg => {
      if (arg.type === 'ObjectExpression') {
        hasObjectArg = true;
        const conditionalArgs = convertObjectToConditionals(arg);
        newArgs.push(...conditionalArgs);
      } else if (arg.type === 'SpreadElement' && arg.argument.type === 'ObjectExpression') {
        hasObjectArg = true;
        const conditionalArgs = convertObjectToConditionals(arg.argument);
        newArgs.push(...conditionalArgs);
      } else {
        newArgs.push(arg);
      }
    });

    if (hasObjectArg) {
      path.node.arguments = newArgs;
      modified = true;
    }
  });

  return modified ? root.toSource() : null;
};
