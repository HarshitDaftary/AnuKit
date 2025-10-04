anukit/
├── packages/
│   ├── core/                 # Design tokens, utilities, types
│   ├── components/           # All UI components
│   ├── icons/               # Optimized icon library  
│   ├── hooks/               # Reusable React hooks
│   ├── styles/              # CSS variables and utilities
│   └── dev-tools/           # Development utilities
├── apps/
│   ├── docs/                # Documentation website
│   ├── playground/          # Component playground
│   └── examples/            # Example applications
├── tools/
│   ├── build/               # Build configuration
│   ├── testing/             # Testing utilities
│   └── eslint-config/       # ESLint configuration
└── scripts/                 # Automation scripts

## Build System Decision: Rollup + SWC

### Why Rollup?
✅ **Superior Tree-shaking**: Best-in-class unused code elimination
✅ **Optimal Bundle Structure**: Creates perfect ES modules
✅ **Plugin Ecosystem**: Rich ecosystem for optimization
✅ **Bundle Analysis**: Built-in tools for size analysis
✅ **Multiple Formats**: ESM, CJS, UMD output support

### Why SWC?
✅ **Speed**: 20x faster than Babel
✅ **TypeScript**: Native TypeScript support
✅ **Modern Features**: Latest ECMAScript support  
✅ **Smaller Output**: Better code generation
✅ **Zero Config**: Works out of the box

### Build Pipeline
1. **TypeScript Compilation** → SWC transforms TS to JS
2. **Tree-shaking** → Rollup eliminates unused code
3. **Minification** → SWC minifies output
4. **CSS Processing** → PostCSS + cssnano
5. **Bundle Analysis** → rollup-plugin-analyzer
6. **Size Tracking** → bundlesize integration

## Performance Targets
- Individual component: <5KB gzipped
- Core + 5 components: <25KB gzipped  
- Tree-shaking effectiveness: >99%
- Build time: <30 seconds for full library