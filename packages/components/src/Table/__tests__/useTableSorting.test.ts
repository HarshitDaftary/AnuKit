/**
 * Unit Tests for Table Sorting Hook
 * Tests extracted business logic for better maintainability
 */

import { renderHook, act } from '@testing-library/react';
import { useTableSorting } from '../Table/hooks/useTableSorting';

// Mock data for testing
const mockData = [
  { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 25, email: 'bob@example.com' },
  { id: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' },
];

const mockColumns = [
  { id: 'name', header: 'Name', accessor: 'name' as keyof typeof mockData[0] },
  { id: 'age', header: 'Age', accessor: 'age' as keyof typeof mockData[0] },
  { id: 'email', header: 'Email', accessor: 'email' as keyof typeof mockData[0] },
];

describe('useTableSorting Hook', () => {
  describe('Basic Functionality', () => {
    it('should return unsorted data initially', () => {
      const { result } = renderHook(() =>
        useTableSorting({
          data: mockData,
          columns: mockColumns,
          enableSorting: true,
        })
      );

      expect(result.current.sortedData).toEqual(mockData);
      expect(result.current.currentSort).toBeNull();
    });

    it('should sort data ascending by name', () => {
      const { result } = renderHook(() =>
        useTableSorting({
          data: mockData,
          columns: mockColumns,
          enableSorting: true,
        })
      );

      act(() => {
        result.current.handleSortChange('name');
      });

      expect(result.current.currentSort).toEqual({
        key: 'name',
        direction: 'asc',
      });

      const sortedNames = result.current.sortedData.map(item => item.name);
      expect(sortedNames).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should sort data descending when clicking same column twice', () => {
      const { result } = renderHook(() =>
        useTableSorting({
          data: mockData,
          columns: mockColumns,
          enableSorting: true,
        })
      );

      // First click - ascending
      act(() => {
        result.current.handleSortChange('name');
      });

      // Second click - descending  
      act(() => {
        result.current.handleSortChange('name');
      });

      expect(result.current.currentSort).toEqual({
        key: 'name',
        direction: 'desc',
      });

      const sortedNames = result.current.sortedData.map(item => item.name);
      expect(sortedNames).toEqual(['Charlie', 'Bob', 'Alice']);
    });
  });

  describe('Controlled Mode', () => {
    it('should use external sort state when provided', () => {
      const mockOnSortChange = jest.fn();
      const externalSort = { key: 'age', direction: 'asc' as const };

      const { result } = renderHook(() =>
        useTableSorting({
          data: mockData,
          columns: mockColumns,
          sort: externalSort,
          onSortChange: mockOnSortChange,
          enableSorting: true,
        })
      );

      expect(result.current.currentSort).toEqual(externalSort);
      
      const sortedAges = result.current.sortedData.map(item => item.age);
      expect(sortedAges).toEqual([25, 30, 35]);
    });

    it('should call onSortChange when sorting changes', () => {
      const mockOnSortChange = jest.fn();

      const { result } = renderHook(() =>
        useTableSorting({
          data: mockData,
          columns: mockColumns,
          onSortChange: mockOnSortChange,
          enableSorting: true,
        })
      );

      act(() => {
        result.current.handleSortChange('email');
      });

      expect(mockOnSortChange).toHaveBeenCalledWith({
        key: 'email',
        direction: 'asc',
      });
    });
  });

  describe('Utility Functions', () => {
    it('should correctly identify sorted columns', () => {
      const { result } = renderHook(() =>
        useTableSorting({
          data: mockData,
          columns: mockColumns,
          enableSorting: true,
        })
      );

      act(() => {
        result.current.handleSortChange('name');
      });

      expect(result.current.isColumnSorted('name')).toBe(true);
      expect(result.current.isColumnSorted('age')).toBe(false);
    });

    it('should return correct sort direction', () => {
      const { result } = renderHook(() =>
        useTableSorting({
          data: mockData,
          columns: mockColumns,
          enableSorting: true,
        })
      );

      act(() => {
        result.current.handleSortChange('name');
      });

      expect(result.current.getSortDirection('name')).toBe('asc');
      expect(result.current.getSortDirection('age')).toBeNull();
    });
  });

  describe('Custom Sort Functions', () => {
    it('should use custom sort function when provided', () => {
      const columnsWithCustomSort = [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as keyof typeof mockData[0],
          sortFn: (a: typeof mockData[0], b: typeof mockData[0]) => {
            // Custom sort: sort by name length
            return a.name.length - b.name.length;
          },
        },
      ];

      const { result } = renderHook(() =>
        useTableSorting({
          data: mockData,
          columns: columnsWithCustomSort,
          enableSorting: true,
        })
      );

      act(() => {
        result.current.handleSortChange('name');
      });

      const sortedNames = result.current.sortedData.map(item => item.name);
      // Sorted by length: Bob(3), Alice(5), Charlie(7)
      expect(sortedNames).toEqual(['Bob', 'Alice', 'Charlie']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data', () => {
      const { result } = renderHook(() =>
        useTableSorting({
          data: [],
          columns: mockColumns,
          enableSorting: true,
        })
      );

      expect(result.current.sortedData).toEqual([]);
    });

    it('should handle null/undefined values', () => {
      const dataWithNulls = [
        { id: 1, name: 'Alice', age: null },
        { id: 2, name: null, age: 25 },
        { id: 3, name: 'Charlie', age: 35 },
      ];

      const { result } = renderHook(() =>
        useTableSorting({
          data: dataWithNulls,
          columns: mockColumns,
          enableSorting: true,
        })
      );

      act(() => {
        result.current.handleSortChange('name');
      });

      // Null values should be sorted to the end
      const sortedData = result.current.sortedData;
      expect(sortedData[0].name).toBe('Alice');
      expect(sortedData[1].name).toBe('Charlie');
      expect(sortedData[2].name).toBeNull();
    });

    it('should handle disabled sorting', () => {
      const { result } = renderHook(() =>
        useTableSorting({
          data: mockData,
          columns: mockColumns,
          enableSorting: false,
        })
      );

      act(() => {
        result.current.handleSortChange('name');
      });

      // Data should remain unsorted
      expect(result.current.sortedData).toEqual(mockData);
    });
  });

  describe('Performance', () => {
    it('should memoize sorted data and not recalculate unnecessarily', () => {
      const { result, rerender } = renderHook(
        (props) => useTableSorting(props),
        {
          initialProps: {
            data: mockData,
            columns: mockColumns,
            enableSorting: true,
          },
        }
      );

      act(() => {
        result.current.handleSortChange('name');
      });

      const firstSortedData = result.current.sortedData;

      // Rerender with same props
      rerender({
        data: mockData,
        columns: mockColumns,
        enableSorting: true,
      });

      // Should return same reference (memoized)
      expect(result.current.sortedData).toBe(firstSortedData);
    });
  });
});

/**
 * Integration Tests
 * Test hook behavior in realistic scenarios
 */
describe('useTableSorting Integration', () => {
  it('should handle rapid sort changes without issues', () => {
    const { result } = renderHook(() =>
      useTableSorting({
        data: mockData,
        columns: mockColumns,
        enableSorting: true,
      })
    );

    // Rapid sort changes
    act(() => {
      result.current.handleSortChange('name');
      result.current.handleSortChange('age');
      result.current.handleSortChange('name');
      result.current.handleSortChange('name'); // Should be desc
    });

    expect(result.current.currentSort).toEqual({
      key: 'name',
      direction: 'desc',
    });
  });

  it('should work with large datasets efficiently', () => {
    // Generate large dataset
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      age: Math.floor(Math.random() * 50) + 20,
    }));

    const { result } = renderHook(() =>
      useTableSorting({
        data: largeData,
        columns: mockColumns,
        enableSorting: true,
      })
    );

    const startTime = performance.now();
    
    act(() => {
      result.current.handleSortChange('age');
    });

    const endTime = performance.now();
    
    // Should complete quickly even with large dataset
    expect(endTime - startTime).toBeLessThan(100); // Less than 100ms
    expect(result.current.sortedData).toHaveLength(1000);
  });
});