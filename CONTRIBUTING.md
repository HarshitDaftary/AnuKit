# OptimUI Contributing Guide

Thank you for your interest in contributing to OptimUI! This guide will help you get started.

## 🚀 Quick Start

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/optimui.git
   cd optimui
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build packages**
   ```bash
   pnpm build
   ```

4. **Start development**
   ```bash
   pnpm dev
   ```

## 📦 Monorepo Structure

Understanding the structure will help you navigate the codebase:

```
optimui/
├── packages/           # Core packages
├── apps/              # Applications (docs, playground, tests)
├── tools/             # Shared tooling
└── scripts/           # Build and utility scripts
```

## 🛠️ Development Workflow

### Adding a New Component

1. **Create component directory**
   ```bash
   mkdir packages/components/src/new-component
   ```

2. **Component structure**
   ```
   new-component/
   ├── index.ts          # Exports
   ├── NewComponent.tsx  # Main component
   ├── NewComponent.test.tsx
   ├── NewComponent.stories.tsx
   └── styles.css
   ```

3. **Follow naming conventions**
   - PascalCase for components
   - kebab-case for directories
   - camelCase for props and functions

### Code Standards

- **TypeScript**: All code must be TypeScript
- **ESLint**: Follow configured rules
- **Prettier**: Auto-format on save
- **Tests**: Required for all components
- **Documentation**: Add JSDoc comments

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter @optimui/components

# Run accessibility tests
pnpm test:a11y

# Run SSR tests
pnpm test:ssr
```

### Bundle Size

All components must meet size requirements:

```bash
# Check bundle sizes
pnpm size

# Individual component analysis
pnpm size --filter @optimui/button
```

## 📏 Component Guidelines

### Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader support
- Focus management
- ARIA attributes

### Performance Requirements

- Individual component <5KB gzipped
- Tree-shakeable exports
- SSR compatible
- No runtime CSS-in-JS

### API Design Principles

1. **Consistent**: Follow established patterns
2. **Composable**: Components work together
3. **Predictable**: Clear prop naming
4. **Flexible**: Support customization
5. **Accessible**: Built-in a11y features

### Example Component

```tsx
import { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        className={clsx(
          'optimui-button',
          `optimui-button--${variant}`,
          `optimui-button--${size}`,
          loading && 'optimui-button--loading',
          className
        )}
        disabled={loading || props.disabled}
        ref={ref}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

## 🧪 Quality Checklist

Before submitting a PR, ensure:

- [ ] Component follows design system
- [ ] TypeScript types are complete
- [ ] Tests pass with >90% coverage
- [ ] Accessibility tests pass
- [ ] Bundle size within limits
- [ ] SSR compatibility verified
- [ ] Documentation updated
- [ ] Examples provided

## 🔄 Pull Request Process

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-component
   ```

2. **Make changes with commits**
   ```bash
   git commit -m "feat(button): add loading state"
   ```

3. **Create changeset**
   ```bash
   pnpm changeset
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/new-component
   ```

### Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

## 📋 Issue Templates

### Bug Report
- **Environment**: Browser, Node.js version
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Code example**

### Feature Request
- **Problem description**
- **Proposed solution**
- **Alternatives considered**
- **Additional context**

## 🎯 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Individual component | <5KB | ✅ |
| Bundle with 5 components | <25KB | ✅ |
| Tree-shaking effectiveness | >99% | ✅ |
| SSR hydration time | <100ms | ✅ |

## 🏆 Recognition

Contributors are recognized in:

- GitHub contributors list
- Release notes
- Documentation credits
- npm package contributors

## 📞 Getting Help

- **Discussions**: GitHub Discussions for questions
- **Issues**: GitHub Issues for bugs
- **Discord**: Community chat (coming soon)
- **Email**: maintainers@optimui.dev

## 📜 Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

---

Thank you for contributing to OptimUI! Together we're building the future of React component libraries. 🚀