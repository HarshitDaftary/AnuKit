# Component Build CI/CD System

This document describes the automated component build system that builds each component individually and generates failure reports for GitHub Copilot to consume.

## Overview

The AnuKit repository now includes a comprehensive build system that:
- 🏗️ **Builds components individually** for better isolation and debugging
- 🔄 **Runs in parallel** using GitHub Actions matrix strategy
- 📊 **Generates detailed failure reports** in JSON format
- 🤖 **Integrates with GitHub Copilot** for automated issue analysis
- 💬 **Comments on PRs** with build status
- 📦 **Uploads artifacts** for later analysis

## Quick Start

### For Developers

When you push changes to component files, the workflow automatically runs and:
1. Discovers all components (currently 30 components)
2. Builds each component in parallel
3. Reports failures immediately in PR comments
4. Uploads failure reports as artifacts

### For CI/CD

The workflow is located at `.github/workflows/build-components.yml` and triggers on:
- Push to `main` or `develop` branches (when component files change)
- Pull requests to `main` or `develop` branches
- Manual trigger via GitHub Actions UI

## Directory Structure

```
.github/
└── workflows/
    └── build-components.yml          # Main CI/CD workflow

tools/
└── build-tools/
    └── scripts/
        ├── README.md                  # Detailed documentation
        ├── EXAMPLE_REPORTS.md         # Example report formats
        ├── build-individual-component.js  # Build single component
        ├── build-all-components.js    # Build all components
        ├── validate-workflow.js       # Validate workflow config
        └── analyze-report.js          # Analyze failure reports

packages/
└── components/
    ├── build-reports/                 # Generated reports (gitignored)
    │   ├── <component>.json          # Individual component reports
    │   └── build-summary.json        # Aggregated summary
    └── src/
        ├── Avatar/
        ├── Button/
        ├── Modal/
        └── ... (30 components total)
```

## Local Build Scripts

### Build a Single Component

```bash
cd tools/build-tools/scripts
node build-individual-component.js Button
```

Outputs:
- `packages/components/dist/Button/index.js` (CommonJS)
- `packages/components/dist/Button/index.esm.js` (ESM)
- `packages/components/dist/Button/*.d.ts` (TypeScript declarations)
- `packages/components/build-reports/Button.json` (Build report)

### Build All Components

```bash
cd tools/build-tools/scripts
node build-all-components.js
```

Outputs:
- Built files for all components in `packages/components/dist/`
- Individual reports in `packages/components/build-reports/`
- Summary report in `packages/components/build-reports/build-summary.json`

### Validate Workflow Configuration

```bash
cd tools/build-tools/scripts
node validate-workflow.js
```

Checks:
- ✅ Workflow structure is correct
- ✅ All required jobs are present
- ✅ Matrix strategy is configured
- ✅ Artifact upload/download is set up
- ✅ PR commenting is enabled

### Analyze Build Reports

```bash
cd tools/build-tools/scripts
node analyze-report.js [path-to-report.json]
```

Provides:
- 📈 Build statistics and success rate
- 🔍 Error categorization
- 💡 Actionable recommendations
- 🛠️ Specific commands to rebuild failed components

## GitHub Actions Workflow

### Workflow Jobs

1. **prepare**
   - Discovers all component directories
   - Outputs component list for matrix strategy

2. **build-components** (matrix job)
   - Builds each component in parallel
   - Continues even if some components fail (fail-fast: false)
   - Generates failure reports for failed builds
   - Uploads reports as artifacts

3. **summarize-results**
   - Downloads all failure reports
   - Creates aggregated summary report
   - Comments on PR with results
   - Uploads summary as artifact
   - Fails workflow if any component failed

### Artifacts

After a workflow run, these artifacts are available:

| Artifact | Content | Retention |
|----------|---------|-----------|
| `build-failure-<Component>` | Individual failure report JSON | 30 days |
| `build-summary-report` | Aggregated summary JSON | 90 days |
| `component-build-<Component>` | Built component files | 7 days |

## Report Format

### Individual Component Report (Success)

```json
{
  "component": "Button",
  "status": "success",
  "timestamp": "2025-01-04T12:34:56.789Z",
  "buildTime": 1234,
  "buildLog": "✅ Generated cjs bundle...\n✅ Generated esm bundle..."
}
```

### Individual Component Report (Failure)

```json
{
  "component": "Button",
  "status": "failure",
  "timestamp": "2025-01-04T12:34:56.789Z",
  "buildTime": 567,
  "error": {
    "message": "Unexpected token (42:10)",
    "stack": "Error: Unexpected token...",
    "code": "PARSE_ERROR",
    "plugin": "typescript",
    "loc": { "line": 42, "column": 10 },
    "frame": "... code context ..."
  },
  "buildLog": "Building Button...\nError occurred...",
  "errorSummary": "Build failed for component Button: Unexpected token (42:10)"
}
```

See `tools/build-tools/scripts/EXAMPLE_REPORTS.md` for more examples.

## Using with GitHub Copilot

### In GitHub Actions

When a build fails:
1. Go to the failed workflow run
2. Download the `build-summary-report` artifact
3. Open the JSON file

### In Copilot Chat

Ask Copilot to analyze and fix the issues:

```
@workspace I have build failures in my components. Can you analyze this report and suggest fixes?

[Paste the JSON content from build-summary-report artifact]
```

Copilot will:
- Identify the root cause of each failure
- Suggest specific code fixes
- Provide commands to rebuild
- Explain the errors in context

### Example Interaction

```
User: @workspace Here's my build report with 2 failures:
{
  "failures": [
    {
      "component": "Button",
      "error": {
        "message": "Cannot find module '@anukit/utils'",
        "code": "MODULE_NOT_FOUND"
      }
    },
    {
      "component": "Modal",
      "error": {
        "message": "Unexpected token (42:10)",
        "code": "PARSE_ERROR"
      }
    }
  ]
}

Copilot: I can help fix these build failures:

1. **Button** - MODULE_NOT_FOUND for '@anukit/utils'
   - Run: `pnpm install` to ensure dependencies are installed
   - Check that @anukit/utils is listed in package.json dependencies
   - Verify the import path in Button component

2. **Modal** - PARSE_ERROR at line 42:10
   - This suggests a syntax error in Modal.tsx
   - Check line 42 for missing brackets, parentheses, or semicolons
   - Common issues: unclosed JSX tags, missing closing braces

After fixing, rebuild:
```bash
cd tools/build-tools/scripts
node build-individual-component.js Button
node build-individual-component.js Modal
```
```

## PR Comments

The workflow automatically comments on pull requests:

```
## 🏗️ Component Build Results

✅ **All 30 components built successfully!**
```

Or when there are failures:

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

### For Developers
- 🚀 **Immediate feedback** on component builds
- 🔍 **Detailed error information** for debugging
- 📦 **Individual component testing** without full build
- 💡 **AI-powered suggestions** from Copilot

### For Teams
- 📊 **Build health visibility** in PRs
- 🔄 **Automated reporting** reduces manual work
- 📈 **Historical tracking** of build issues
- 🤝 **Better collaboration** through structured reports

### For CI/CD
- ⚡ **Parallel builds** speed up workflow
- 🎯 **Isolated failures** don't block everything
- 📦 **Artifact retention** for investigation
- 🔁 **Automated retries** for transient failures

## Troubleshooting

### Build fails locally but not in CI

Check versions match:
- Node.js: 20.x
- pnpm: 8.10.0

### Missing dependencies

Run `pnpm install --no-frozen-lockfile` in repository root.

### Workflow not triggering

Ensure changes are in paths specified in workflow:
- `packages/components/src/**`
- `packages/core/**`
- `packages/utils/**`

### Can't download artifacts

Artifacts expire after retention period:
- Failure reports: 30 days
- Summary reports: 90 days
- Build artifacts: 7 days

## Future Enhancements

- [ ] Add build caching to speed up builds
- [ ] Generate visual reports with charts
- [ ] Add performance benchmarks to reports
- [ ] Integrate with code quality tools
- [ ] Add automatic issue creation for persistent failures
- [ ] Add Slack/Teams notifications for build failures

## Contributing

When adding new components:
1. No configuration needed - automatic discovery
2. Follow existing component structure
3. Ensure component has `index.ts` export file
4. Test locally before pushing:
   ```bash
   cd tools/build-tools/scripts
   node build-individual-component.js <YourComponent>
   ```

## Support

For issues or questions:
1. Check `tools/build-tools/scripts/README.md` for detailed documentation
2. Review `tools/build-tools/scripts/EXAMPLE_REPORTS.md` for report examples
3. Run `node validate-workflow.js` to verify workflow configuration
4. Run `node analyze-report.js` to analyze build failures
5. Use GitHub Copilot to get AI-powered suggestions

---

**Last Updated**: 2025-01-04  
**Components**: 30  
**Workflow Version**: 1.0.0
