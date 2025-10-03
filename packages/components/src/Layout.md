# OptimUI Layout Components

Advanced layout components for building responsive, accessible UIs with excellent performance.

## Components

### Grid Component

A powerful CSS Grid wrapper with responsive capabilities.

```tsx
import { Grid } from '@optimui/components';

// Basic grid
<Grid cols={3} gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// Responsive grid
<Grid 
  cols={{
    default: 1,
    md: 2,
    lg: 3
  }}
  gap={6}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// Auto-fit grid
<Grid cols="auto-fit" minColWidth="250px" gap={4}>
  <div>Auto-sized item 1</div>
  <div>Auto-sized item 2</div>
  <div>Auto-sized item 3</div>
</Grid>
```

#### Props

- `cols`: Number of columns or responsive configuration
- `rows`: Number of rows
- `gap`: Gap between grid items (0-24 scale)
- `minColWidth`: Minimum column width for auto-fit/auto-fill
- `templateColumns`: Custom grid-template-columns
- `templateRows`: Custom grid-template-rows
- `autoFlow`: Grid auto flow direction

### Flex Component

A flexible Flexbox wrapper with responsive direction support.

```tsx
import { Flex } from '@optimui/components';

// Basic flex
<Flex direction="row" justify="center" align="center" gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>

// Responsive direction
<Flex 
  direction={{
    default: 'col',
    md: 'row'
  }}
  gap={6}
  wrap
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>
```

#### Props

- `direction`: Flex direction or responsive configuration
- `justify`: Main axis alignment
- `align`: Cross axis alignment
- `alignContent`: Content alignment for wrapped lines
- `wrap`: Flex wrap behavior
- `gap`: Gap between flex items
- `grow`: Whether items should grow equally
- `shrink`: Whether items should shrink equally

### Container Component

A responsive container with max-width breakpoints.

```tsx
import { Container } from '@optimui/components';

// Basic container
<Container size="lg" px={4}>
  <p>Content within a responsive container</p>
</Container>

// Fluid container
<Container size="fluid" py={8}>
  <p>Content within a fluid container</p>
</Container>

// Custom padding
<Container size="xl" p={6}>
  <p>Content with all-around padding</p>
</Container>
```

#### Props

- `size`: Container breakpoint ('sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fluid')
- `px`: Horizontal padding
- `py`: Vertical padding
- `p`: All-around padding
- `center`: Whether to center the container (default: true)

### Stack Component

A component for stacking elements vertically or horizontally with consistent spacing.

```tsx
import { Stack } from '@optimui/components';

// Vertical stack
<Stack direction="vertical" gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

// Horizontal stack with dividers
<Stack direction="horizontal" gap={6} divider>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

// Custom divider
<Stack 
  direction="vertical" 
  gap={4} 
  divider 
  dividerElement={<hr />}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>
```

#### Props

- `direction`: Stack direction ('vertical' | 'horizontal')
- `gap`: Gap between stack items
- `align`: Cross-axis alignment
- `justify`: Main-axis alignment
- `divider`: Whether to add dividers between items
- `dividerElement`: Custom divider element
- `wrap`: Whether items should wrap

## Layout Patterns

### Page Layout

```tsx
<Container size="xl">
  <Grid cols={{ default: 1, lg: 4 }} gap={6}>
    <div className="lg:col-span-1">
      {/* Sidebar */}
    </div>
    <div className="lg:col-span-3">
      {/* Main content */}
    </div>
  </Grid>
</Container>
```

### Card Grid

```tsx
<Container size="lg">
  <Grid cols="auto-fit" minColWidth="300px" gap={6}>
    {cards.map(card => (
      <Card key={card.id}>{card.content}</Card>
    ))}
  </Grid>
</Container>
```

### Navigation Layout

```tsx
<Flex direction="row" justify="between" align="center" px={4} py={2}>
  <div>Logo</div>
  <Stack direction="horizontal" gap={6}>
    <a href="/home">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </Stack>
</Flex>
```

## Performance Features

- **Zero Runtime CSS-in-JS**: Uses CSS variables and utility classes
- **Perfect Tree-shaking**: Import only components you use
- **SSR Compatible**: No hydration mismatches
- **Responsive by Default**: Mobile-first responsive design
- **Small Bundle Size**: Each component < 3KB gzipped

## Accessibility

- Proper semantic HTML structure
- ARIA roles where appropriate
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## Browser Support

- Modern browsers (ES2020+)
- Safari 12+
- Chrome 80+
- Firefox 80+
- Edge 80+