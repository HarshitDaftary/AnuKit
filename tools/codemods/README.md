# Codemods

This directory contains codemods for the AnuKit/OptimUI project.

## cn-object-to-conditions.js

Transforms object-style `cn()` calls to conditional string arguments.

### What it does

The `cn()` utility function in this project only accepts `(string | undefined | null | false)[]` arguments. This codemod transforms code that incorrectly passes object literals to use conditional strings instead.

### Examples

**Before:**
```typescript
cn({
  'class-active': isActive,
  'class-disabled': disabled,
})
```

**After:**
```typescript
cn(
  isActive && 'class-active',
  disabled && 'class-disabled'
)
```

**Before:**
```typescript
cn('base-class', {
  [`${prefix}--size-sm`]: size === 'sm',
  [`${prefix}--size-lg`]: size === 'lg',
})
```

**After:**
```typescript
cn(
  'base-class',
  size === 'sm' && `${prefix}--size-sm`,
  size === 'lg' && `${prefix}--size-lg`
)
```

### Usage

Run the codemod using the npm script:

```bash
pnpm run codemod:cn
```

Or run it directly:

```bash
pnpm dlx jscodeshift -t tools/codemods/cn-object-to-conditions.js packages --extensions=ts,tsx,js,jsx --parser=tsx
```

### Options

- `--dry` - Preview changes without modifying files
- `--print` - Print output instead of writing to files

Example dry run:
```bash
pnpm dlx jscodeshift -t tools/codemods/cn-object-to-conditions.js packages --extensions=ts,tsx,js,jsx --parser=tsx --dry --print
```

## Preventing regressions

ESLint rules have been added to `.eslintrc.js` to prevent object literals being passed to `cn()` calls:

```bash
pnpm run lint:strict
```

This will fail if any code uses object literals with `cn()`.
