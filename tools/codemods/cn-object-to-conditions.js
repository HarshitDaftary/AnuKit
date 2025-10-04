/**
 * Codemod: cn-object-to-conditions
 * Transforms cn({ a: cond, b: true }) -> cn(cond && 'a', 'b')
 * and cn('x', { y: foo === 'bar' }, className) -> cn('x', foo === 'bar' && 'y', className)
 *
 * Usage:
 *  npx jscodeshift -t tools/codemods/cn-object-to-conditions.js packages \
 *    --extensions=ts,tsx,js,jsx --parser=tsx
 */


module.exports = function transformer(file, api, options) {
  // Ensure TSX parser for TS/JSX files
  const j = api.jscodeshift.withParser('tsx');
  const root = j(file.source);

  function isCnCallee(callee) {
    return (
      (callee.type === 'Identifier' && callee.name === 'cn') ||
      (callee.type === 'MemberExpression' && callee.property && callee.property.type === 'Identifier' && callee.property.name === 'cn')
    );
  }

  function transformObjectArg(objExpr, j) {
    // Convert { key: value } -> (value && 'key') when value not Literal true/false
    // If value is true -> 'key'; if false -> nothing
    const parts = [];
    for (const prop of objExpr.properties) {
      if (prop.type !== 'Property' && prop.type !== 'ObjectProperty') continue;
      // Determine the expression that represents the class name
      let keyExpr = null;
      if (prop.computed) {
        // e.g., { [templateOrExpr]: cond }
        keyExpr = prop.key;
      } else if (prop.key.type === 'Identifier') {
        keyExpr = j.literal(prop.key.name);
      } else if (prop.key.type === 'Literal') {
        keyExpr = j.literal(String(prop.key.value));
      } else if (prop.key.type === 'TemplateLiteral') {
        keyExpr = prop.key;
      }
      if (!keyExpr) continue;

      const value = prop.value;
      if (value.type === 'Literal') {
        if (value.value === true) {
          parts.push(keyExpr);
        }
        // false -> drop
      } else {
        parts.push(j.logicalExpression('&&', value, keyExpr));
      }
    }
    return parts;
  }

  root.find(j.CallExpression)
    .filter(p => isCnCallee(p.node.callee))
    .forEach(path => {
    const args = path.node.arguments;
    const newArgs = [];
    let changed = false;

    for (const arg of args) {
      if (arg.type === 'ObjectExpression') {
        const parts = transformObjectArg(arg, j);
        newArgs.push(...parts);
        changed = true;
      } else if (arg.type === 'SpreadElement' && arg.argument.type === 'ObjectExpression') {
        const parts = transformObjectArg(arg.argument, j);
        // cannot spread conditionals directly; instead, append
        newArgs.push(...parts);
        changed = true;
      } else {
        newArgs.push(arg);
      }
    }

    if (changed) {
      path.node.arguments = newArgs.length ? newArgs : [j.literal("")];
    }
    });

  return root.toSource({ quote: 'single' });
};
