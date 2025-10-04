# Component Build System

This directory contains scripts and workflows for building components individually and generating failure reports.

## Overview

The component build system allows you to:
- Build all components individually for better isolation and debugging
- Generate detailed failure reports when builds fail
- Automatically create reports that can be consumed by GitHub Copilot to fix issues

## GitHub Actions Workflow

### `.github/workflows/build-components.yml`

This workflow:
1. **Discovers all components** in `packages/components/src/`
2. **Builds each component in parallel** using a matrix strategy
3. **Continues building** even if some components fail (fail-fast: false)
4. **Generates JSON reports** for each failed component with:
   - Component name
   - Error messages
   - Build logs
   - Stack traces
   - Timestamp
5. **Uploads failure reports** as artifacts for 30 days
6. **Creates a summary report** combining all failures
7. **Comments on PRs** with build results
8. **Fails the workflow** if any component failed

### Triggers

The workflow runs on:
- Push to `main` or `develop` branches (when component files change)
- Pull requests to `main` or `develop` branches (when component files change)
- Manual trigger via `workflow_dispatch`

## Local Build Scripts

### `build-individual-component.js`

Build a single component and generate a report.

**Usage:**
```bash
cd tools/build-tools/scripts
node build-individual-component.js <component-name>

# Example
node build-individual-component.js Button
```

**Output:**
- Built files in `packages/components/dist/<component-name>/`
- Report in `packages/components/build-reports/<component-name>.json`

### `build-all-components.js`

Build all components sequentially and generate a summary report.

**Usage:**
```bash
cd tools/build-tools/scripts
node build-all-components.js
```

**Output:**
- Built files for all components in `packages/components/dist/`
- Individual reports in `packages/components/build-reports/`
- Summary report in `packages/components/build-reports/build-summary.json`

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
    "message": "Unexpected token",
    "stack": "Error: Unexpected token...",
    "code": "PARSE_ERROR",
    "plugin": "typescript",
    "loc": { "line": 42, "column": 10 },
    "frame": "..."
  },
  "buildLog": "Building Button...\nError occurred...",
  "errorSummary": "Build failed for component Button: Unexpected token"
}
```

### Summary Report

```json
{
  "workflow": "Build All Components",
  "timestamp": "2025-01-04T12:34:56.789Z",
  "totalTime": 12345,
  "total_components": 30,
  "successful_components": 28,
  "failed_components": 2,
  "results": [...],
  "failures": [...]
}
```

## Using Reports with GitHub Copilot

### In GitHub Actions

1. When a build fails, download the `build-summary-report` artifact
2. The artifact contains a JSON file with all failure details
3. GitHub Copilot can analyze this report to:
   - Identify the root cause of failures
   - Suggest code fixes
   - Generate patches

### Locally

1. Run `node build-all-components.js`
2. Check `packages/components/build-reports/build-summary.json`
3. Share the report with GitHub Copilot in chat:
   - "Analyze this build report and suggest fixes: [paste report]"
   - "Fix the build failures in this report: [paste report]"

## Benefits

1. **Parallel Building**: Components build in parallel in CI/CD
2. **Isolation**: Each component builds independently
3. **Better Debugging**: Individual reports make it easier to identify issues
4. **AI-Friendly**: Structured JSON reports can be consumed by AI tools
5. **Continuous Monitoring**: Track build health over time
6. **Fast Feedback**: Get immediate feedback on PR changes

## Maintenance

### Adding New Components

New components are automatically discovered - no configuration needed!

### Customizing Build

To customize the build for specific components:
1. Edit the rollup configuration in the workflow or script
2. Add component-specific conditions if needed

### Report Retention

- Failure reports: 30 days (configurable in workflow)
- Summary reports: 90 days (configurable in workflow)
- Build artifacts: 7 days (configurable in workflow)

## Troubleshooting

### "Component not found" error

Ensure the component directory exists in `packages/components/src/`

### Build fails locally but not in CI

Check Node.js and pnpm versions match:
- Node.js: 20.x
- pnpm: 8.10.0

### Missing dependencies

Run `pnpm install` in the repository root first.

## Future Enhancements

- [ ] Add build caching to speed up builds
- [ ] Generate visual reports with charts
- [ ] Add performance benchmarks to reports
- [ ] Integrate with code quality tools
- [ ] Add automatic issue creation for persistent failures
