# Example Build Failure Report

This is an example of what a build failure report looks like when a component fails to build.

## Individual Component Failure Report

```json
{
  "component": "Button",
  "status": "failure",
  "timestamp": "2025-01-04T10:30:45.123Z",
  "buildTime": 567,
  "error": {
    "message": "Unexpected token (42:10)",
    "stack": "Error: Unexpected token (42:10)\n    at Parser.raise (/path/to/parser.js:123:45)\n    at Parser.unexpected (/path/to/parser.js:456:78)",
    "code": "PARSE_ERROR",
    "plugin": "typescript",
    "loc": {
      "line": 42,
      "column": 10,
      "file": "src/Button/Button.tsx"
    },
    "frame": "  40 | const Button = forwardRef<HTMLButtonElement, ButtonProps>(\n  41 |   ({ children, variant = 'primary', size = 'md', ...props }, ref) => {\n> 42 |     return <button ref={ref} className={cn(\n     |          ^\n  43 |       `anukit-btn`,\n  44 |       `anukit-btn-${variant}`,\n  45 |       `anukit-btn-${size}`"
  },
  "buildLog": "Building Button component...\n[typescript] Error: Unexpected token at Button.tsx:42:10\nBuild failed",
  "errorSummary": "Build failed for component Button: Unexpected token (42:10)"
}
```

## Summary Report (Multiple Failures)

```json
{
  "workflow": "Build Components Individually",
  "timestamp": "2025-01-04T10:35:12.456Z",
  "totalTime": 45678,
  "total_components": 30,
  "successful_components": 28,
  "failed_components": 2,
  "results": [
    {
      "component": "Avatar",
      "status": "success",
      "timestamp": "2025-01-04T10:30:15.123Z",
      "buildTime": 1234,
      "buildLog": "✅ Generated cjs bundle: dist/Avatar/index.js\n✅ Generated esm bundle: dist/Avatar/index.esm.js\n✅ Successfully built Avatar in 1234ms"
    },
    {
      "component": "Button",
      "status": "failure",
      "timestamp": "2025-01-04T10:30:45.123Z",
      "buildTime": 567,
      "error": {
        "message": "Unexpected token (42:10)",
        "code": "PARSE_ERROR",
        "plugin": "typescript"
      },
      "errorSummary": "Build failed for component Button: Unexpected token (42:10)"
    },
    {
      "component": "Modal",
      "status": "failure",
      "timestamp": "2025-01-04T10:31:23.789Z",
      "buildTime": 890,
      "error": {
        "message": "Cannot find module '@anukit/utils'",
        "code": "MODULE_NOT_FOUND"
      },
      "errorSummary": "Build failed for component Modal: Cannot find module '@anukit/utils'"
    }
  ],
  "failures": [
    {
      "component": "Button",
      "status": "failure",
      "errorSummary": "Build failed for component Button: Unexpected token (42:10)"
    },
    {
      "component": "Modal",
      "status": "failure",
      "errorSummary": "Build failed for component Modal: Cannot find module '@anukit/utils'"
    }
  ]
}
```

## How GitHub Copilot Can Use This

### In Chat

1. Download the `build-summary-report` artifact from GitHub Actions
2. Paste the JSON content in a Copilot chat:
   ```
   @workspace I have these build failures, can you help fix them?
   
   [paste the summary JSON]
   ```

3. Copilot will analyze the errors and suggest fixes for each component

### Example Copilot Response

For the Button error above, Copilot might suggest:

```typescript
// The error is at line 42 column 10 - likely a missing closing parenthesis
// Here's the fix:

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button 
        ref={ref} 
        className={cn(
          `anukit-btn`,
          `anukit-btn-${variant}`,
          `anukit-btn-${size}`
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
```

## GitHub Actions Artifacts

After a workflow run, you'll find these artifacts:

1. **build-failure-\<ComponentName\>** (one per failed component)
   - Contains individual failure report JSON
   - Retained for 30 days

2. **build-summary-report**
   - Contains aggregated summary JSON
   - Retained for 90 days
   - This is the main file to download and analyze

3. **component-build-\<ComponentName\>** (one per successful component)
   - Contains the built component files
   - Retained for 7 days

## PR Comments

The workflow automatically comments on pull requests with a summary:

```
## 🏗️ Component Build Results

⚠️ **Build Summary:**
- ✅ Successful: 28/30
- ❌ Failed: 2/30

### Failed Components:

- **Button**: Build failed
- **Modal**: Build failed

📥 Download the `build-summary-report` artifact for detailed error logs.

🤖 GitHub Copilot can analyze the failure report to suggest fixes.
```

## Benefits

1. **Structured Error Information**: All errors in machine-readable JSON format
2. **Context Preservation**: Stack traces, line numbers, and code frames included
3. **Easy Debugging**: Download reports and analyze offline
4. **AI-Friendly**: Perfect for AI tools like GitHub Copilot to analyze
5. **Historical Tracking**: Reports retained for 30-90 days
6. **Automated Feedback**: PR comments keep team informed
