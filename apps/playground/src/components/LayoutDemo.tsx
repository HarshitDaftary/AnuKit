import React from 'react';
import { Grid, Flex, Container, Stack } from '@optimui/components';

export function LayoutDemo() {
  return (
    <div className="space-y-12 py-8">
      {/* Page Header */}
      <Container size="xl">
        <Flex direction="col" align="center" gap={4}>
          <h1 className="text-4xl font-bold text-center">OptimUI Layout Components</h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl">
            Responsive, accessible layout components built for performance
          </p>
        </Flex>
      </Container>

      {/* Grid Demo */}
      <Container size="xl">
        <Stack direction="vertical" gap={6}>
          <h2 className="text-2xl font-semibold">Grid Component</h2>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Responsive Grid</h3>
            <Grid 
              cols={{
                default: 1,
                sm: 2,
                lg: 3,
                xl: 4
              }}
              gap={4}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <div 
                  key={i}
                  className="bg-blue-100 p-6 rounded-lg text-center font-medium"
                >
                  Item {i + 1}
                </div>
              ))}
            </Grid>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Auto-fit Grid</h3>
            <Grid cols="auto-fit" minColWidth="250px" gap={4}>
              {Array.from({ length: 6 }, (_, i) => (
                <div 
                  key={i}
                  className="bg-green-100 p-6 rounded-lg text-center font-medium"
                >
                  Auto-sized {i + 1}
                </div>
              ))}
            </Grid>
          </div>
        </Stack>
      </Container>

      {/* Flex Demo */}
      <Container size="xl">
        <Stack direction="vertical" gap={6}>
          <h2 className="text-2xl font-semibold">Flex Component</h2>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Responsive Direction</h3>
            <Flex 
              direction={{
                default: 'col',
                md: 'row'
              }}
              gap={4}
              align="stretch"
            >
              <div className="bg-purple-100 p-6 rounded-lg flex-1">
                <h4 className="font-medium">Flexible Item 1</h4>
                <p>This item will stack vertically on mobile and horizontally on desktop.</p>
              </div>
              <div className="bg-purple-100 p-6 rounded-lg flex-1">
                <h4 className="font-medium">Flexible Item 2</h4>
                <p>Responsive layouts made simple with OptimUI.</p>
              </div>
              <div className="bg-purple-100 p-6 rounded-lg flex-1">
                <h4 className="font-medium">Flexible Item 3</h4>
                <p>Perfect for building complex layouts.</p>
              </div>
            </Flex>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Justified Content</h3>
            <Flex justify="between" align="center" gap={4}>
              <div className="bg-yellow-100 p-4 rounded-lg">Left</div>
              <div className="bg-yellow-100 p-4 rounded-lg">Center</div>
              <div className="bg-yellow-100 p-4 rounded-lg">Right</div>
            </Flex>
          </div>
        </Stack>
      </Container>

      {/* Stack Demo */}
      <Container size="xl">
        <Stack direction="vertical" gap={6}>
          <h2 className="text-2xl font-semibold">Stack Component</h2>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Vertical Stack with Dividers</h3>
            <Stack direction="vertical" gap={0} divider>
              <div className="p-4">
                <h4 className="font-medium">Section 1</h4>
                <p>Content for the first section</p>
              </div>
              <div className="p-4">
                <h4 className="font-medium">Section 2</h4>
                <p>Content for the second section</p>
              </div>
              <div className="p-4">
                <h4 className="font-medium">Section 3</h4>
                <p>Content for the third section</p>
              </div>
            </Stack>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Horizontal Stack</h3>
            <Stack direction="horizontal" gap={4} align="center">
              <div className="bg-red-100 p-3 rounded-lg">Item A</div>
              <div className="bg-red-100 p-3 rounded-lg">Item B</div>
              <div className="bg-red-100 p-3 rounded-lg">Item C</div>
            </Stack>
          </div>
        </Stack>
      </Container>

      {/* Container Demo */}
      <div className="bg-gray-50 py-8">
        <Container size="sm">
          <Stack direction="vertical" gap={4} align="center">
            <h2 className="text-2xl font-semibold">Container Component</h2>
            <p className="text-center">
              This content is within a small container (640px max-width) 
              to demonstrate responsive container sizing.
            </p>
          </Stack>
        </Container>
      </div>

      {/* Complex Layout Example */}
      <Container size="xl">
        <Stack direction="vertical" gap={8}>
          <h2 className="text-2xl font-semibold">Complex Layout Example</h2>
          
          <Grid cols={{ default: 1, lg: 4 }} gap={6}>
            <div className="lg:col-span-1">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-medium mb-4">Sidebar</h3>
                <Stack direction="vertical" gap={3}>
                  <a href="#" className="text-blue-600 hover:text-blue-800">Navigation Item 1</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">Navigation Item 2</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">Navigation Item 3</a>
                </Stack>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <Stack direction="vertical" gap={6}>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-4">Main Content Area</h3>
                  <p className="mb-4">
                    This demonstrates a complex layout using OptimUI components. 
                    The sidebar collapses on mobile and expands on desktop.
                  </p>
                  
                  <Grid cols={{ default: 1, sm: 2 }} gap={4}>
                    <div className="bg-blue-50 p-4 rounded">
                      <h4 className="font-medium">Feature 1</h4>
                      <p>Description of feature</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded">
                      <h4 className="font-medium">Feature 2</h4>
                      <p>Description of feature</p>
                    </div>
                  </Grid>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <Flex justify="between" align="center" gap={4}>
                    <div>
                      <h4 className="font-medium">Footer Content</h4>
                      <p className="text-sm text-gray-600">Additional information</p>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded">
                      Action Button
                    </div>
                  </Flex>
                </div>
              </Stack>
            </div>
          </Grid>
        </Stack>
      </Container>
    </div>
  );
}

export default LayoutDemo;