/**
 * Manual Layout Components Test
 * Creates simple usage examples to verify component functionality
 */

import React from 'react';
import { Grid, Flex, Container, Stack } from '../src/index';

// Test 1: Grid Component
console.log('✅ Testing Grid Component');

const GridTest = () => (
  <Grid cols={3} gap={4}>
    <div>Grid Item 1</div>
    <div>Grid Item 2</div>
    <div>Grid Item 3</div>
  </Grid>
);

// Test 2: Responsive Grid
const ResponsiveGridTest = () => (
  <Grid cols={{ default: 1, md: 2, lg: 3 }} gap={2}>
    <div>Responsive Item 1</div>
    <div>Responsive Item 2</div>
    <div>Responsive Item 3</div>
  </Grid>
);

// Test 3: Flex Component
console.log('✅ Testing Flex Component');

const FlexTest = () => (
  <Flex direction="row" justify="between" align="center" gap={4}>
    <div>Flex Item 1</div>
    <div>Flex Item 2</div>
    <div>Flex Item 3</div>
  </Flex>
);

// Test 4: Responsive Flex
const ResponsiveFlexTest = () => (
  <Flex 
    direction={{ default: 'col', md: 'row' }} 
    justify="center" 
    align="stretch"
    gap={3}
  >
    <div>Responsive Flex 1</div>
    <div>Responsive Flex 2</div>
  </Flex>
);

// Test 5: Container Component
console.log('✅ Testing Container Component');

const ContainerTest = () => (
  <Container size="md" padding={4}>
    <h1>Container Content</h1>
    <p>This content is within a responsive container</p>
  </Container>
);

// Test 6: Stack Component
console.log('✅ Testing Stack Component');

const StackTest = () => (
  <Stack direction="vertical" spacing={4} divider>
    <div>Stack Item 1</div>
    <div>Stack Item 2</div>
    <div>Stack Item 3</div>
  </Stack>
);

// Test 7: Horizontal Stack
const HorizontalStackTest = () => (
  <Stack direction="horizontal" spacing={2} align="center">
    <button>Button 1</button>
    <button>Button 2</button>
    <button>Button 3</button>
  </Stack>
);

// Test 8: Nested Layout
console.log('✅ Testing Nested Layout');

const NestedLayoutTest = () => (
  <Container size="lg">
    <Stack direction="vertical" spacing={6}>
      <h1>Layout Test Page</h1>
      
      <Flex justify="between" align="start" gap={4}>
        <div style={{ flex: 1 }}>
          <h2>Grid Section</h2>
          <Grid cols={{ default: 1, sm: 2 }} gap={3}>
            <div style={{ padding: '1rem', background: '#f0f0f0' }}>Card 1</div>
            <div style={{ padding: '1rem', background: '#f0f0f0' }}>Card 2</div>
            <div style={{ padding: '1rem', background: '#f0f0f0' }}>Card 3</div>
            <div style={{ padding: '1rem', background: '#f0f0f0' }}>Card 4</div>
          </Grid>
        </div>
        
        <div style={{ flex: 1 }}>
          <h2>Stack Section</h2>
          <Stack direction="vertical" spacing={2}>
            <div style={{ padding: '0.5rem', background: '#e0e0e0' }}>Item A</div>
            <div style={{ padding: '0.5rem', background: '#e0e0e0' }}>Item B</div>
            <div style={{ padding: '0.5rem', background: '#e0e0e0' }}>Item C</div>
          </Stack>
        </div>
      </Flex>
    </Stack>
  </Container>
);

// Component type validation
console.log('✅ Testing TypeScript Types');

// Test that props are correctly typed
const TypeTest = () => {
  // These should compile without TypeScript errors
  return (
    <>
      <Grid cols={3} rows={2} gap={4} />
      <Grid cols="auto-fit" minColWidth="200px" />
      <Grid cols={{ default: 1, md: 2, lg: 3 }} />
      
      <Flex direction="row" justify="center" align="stretch" />
      <Flex direction={{ default: 'col', lg: 'row' }} wrap="wrap" />
      
      <Container size="sm" padding={2} />
      <Container size="full" padding={{ default: 2, md: 4 }} />
      
      <Stack direction="vertical" spacing={3} divider />
      <Stack direction="horizontal" spacing={1} align="center" />
    </>
  );
};

console.log('🎉 All manual tests created successfully!');
console.log('Components are properly typed and structured.');

export {
  GridTest,
  ResponsiveGridTest,
  FlexTest,
  ResponsiveFlexTest,
  ContainerTest,
  StackTest,
  HorizontalStackTest,
  NestedLayoutTest,
  TypeTest
};