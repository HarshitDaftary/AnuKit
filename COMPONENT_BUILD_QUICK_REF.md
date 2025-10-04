# Component Build System - Quick Reference

## 🚀 Quick Commands

### Build Single Component
```bash
cd tools/build-tools/scripts
node build-individual-component.js <ComponentName>
```

### Build All Components
```bash
cd tools/build-tools/scripts
node build-all-components.js
```

### Validate Workflow
```bash
cd tools/build-tools/scripts
node validate-workflow.js
```

### Analyze Report
```bash
cd tools/build-tools/scripts
node analyze-report.js [path-to-report.json]
```

## 📊 Workflow Triggers

| Event | Trigger | Branch |
|-------|---------|--------|
| Push | Auto | main, develop |
| PR | Auto | main, develop |
| Manual | Actions UI | Any |

## 📦 Artifacts

| Name | Retention | Content |
|------|-----------|---------|
| build-failure-* | 30 days | Individual failure reports |
| build-summary-report | 90 days | Aggregated summary |
| component-build-* | 7 days | Built component files |

## 🤖 Using with Copilot

1. Download `build-summary-report` artifact
2. Open in Copilot chat:
   ```
   @workspace Analyze this build report and suggest fixes:
   [paste JSON]
   ```

## 📁 File Locations

```
.github/workflows/build-components.yml   # Main workflow
tools/build-tools/scripts/               # Build scripts
packages/components/build-reports/       # Generated reports (gitignored)
```

## ✅ Success Indicators

- Green checkmark in PR ✅
- "All components built successfully" comment
- All artifacts uploaded

## ❌ Failure Indicators

- Red X in PR ❌
- "Failed: X/Y" in PR comment
- build-failure-* artifacts present
- build-summary-report contains failures

## 🔧 Common Issues

| Issue | Solution |
|-------|----------|
| MODULE_NOT_FOUND | Run `pnpm install` |
| PARSE_ERROR | Check syntax at error location |
| TYPE_ERROR | Fix TypeScript type issues |
| Build timeout | Increase timeout in workflow |

## 📈 Report Analysis

The analyzer provides:
- Success rate percentage
- Error categorization
- Failed component list
- Rebuild commands
- Copilot-ready insights

## 💡 Tips

- Check PR comments for quick status
- Download summary report for details
- Use analyze-report.js for insights
- Let Copilot suggest fixes
- Rebuild failed components individually

## 🎯 Components

Total: **30 components**
Located in: `packages/components/src/`

Auto-discovered, no configuration needed!

---

See [COMPONENT_BUILD_SYSTEM.md](./COMPONENT_BUILD_SYSTEM.md) for complete documentation.
