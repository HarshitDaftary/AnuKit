/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Grid } from '../Grid/Grid';

describe('Grid Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Grid>
        <div>Test content</div>
      </Grid>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies correct column classes', () => {
    const { container } = render(
      <Grid cols={3}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('optimui-grid');
    expect(gridElement).toHaveClass('optimui-grid-cols-3');
  });

  it('applies responsive column classes', () => {
    const { container } = render(
      <Grid cols={{ default: 1, md: 2, lg: 3 }}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('optimui-grid');
    expect(gridElement).toHaveClass('optimui-grid-cols-1');
    expect(gridElement).toHaveClass('md:optimui-grid-cols-2');
    expect(gridElement).toHaveClass('lg:optimui-grid-cols-3');
  });

  it('applies gap classes correctly', () => {
    const { container } = render(
      <Grid cols={2} gap={6}>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('optimui-gap-6');
  });

  it('applies auto-fit grid styles', () => {
    const { container } = render(
      <Grid cols="auto-fit" minColWidth="250px">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(250px, 1fr))');
  });

  it('applies custom template columns', () => {
    const { container } = render(
      <Grid templateColumns="1fr 2fr 1fr">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement.style.gridTemplateColumns).toBe('1fr 2fr 1fr');
  });

  it('applies ARIA grid role', () => {
    const { container } = render(
      <Grid cols={2}>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveAttribute('role', 'grid');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Grid ref={ref} cols={2}>
        <div>Item 1</div>
      </Grid>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through additional props', () => {
    const { container } = render(
      <Grid cols={2} data-testid="custom-grid" id="grid-test">
        <div>Item 1</div>
      </Grid>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveAttribute('data-testid', 'custom-grid');
    expect(gridElement).toHaveAttribute('id', 'grid-test');
  });
});