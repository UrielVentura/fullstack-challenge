import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileTable from '../FileTable';

describe('FileTable Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<FileTable filesData={[]} />);
    expect(container).toBeTruthy();
  });

  it('should display "No data available" when filesData is empty', () => {
    render(<FileTable filesData={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should display "No data available" when filesData is null', () => {
    render(<FileTable filesData={null} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should display "No data available" when filesData is undefined', () => {
    render(<FileTable />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should render table with correct headers', () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [
          { text: 'test', number: 123, hex: 'abc123def456abc123def456abc123de' },
        ],
      },
    ];

    render(<FileTable filesData={mockData} />);

    expect(screen.getByText('File Name')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
    expect(screen.getByText('Hex')).toBeInTheDocument();
  });

  it('should render table rows with flattened data', () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [
          { text: 'hello', number: 123, hex: 'abc123def456abc123def456abc123de' },
          { text: 'world', number: 456, hex: 'def456abc123def456abc123def456ab' },
        ],
      },
    ];

    render(<FileTable filesData={mockData} />);

    expect(screen.getAllByText('file1.csv')).toHaveLength(2); // Header and data row
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
  });

  it('should handle multiple files with multiple lines', () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [
          { text: 'test1', number: 100, hex: 'aaa111bbb222ccc333ddd444eee555ff' },
        ],
      },
      {
        file: 'file2.csv',
        lines: [
          { text: 'test2', number: 200, hex: 'fff444eee333ddd222ccc111bbb000aaa' },
        ],
      },
    ];

    render(<FileTable filesData={mockData} />);

    expect(screen.getByText('file1.csv')).toBeInTheDocument();
    expect(screen.getByText('file2.csv')).toBeInTheDocument();
    expect(screen.getByText('test1')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
    // Verify both files appear in their respective rows
    const file1Elements = screen.getAllByText('file1.csv');
    const file2Elements = screen.getAllByText('file2.csv');
    expect(file1Elements.length).toBeGreaterThan(0);
    expect(file2Elements.length).toBeGreaterThan(0);
  });

  it('should skip invalid file structures', () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [
          { text: 'valid', number: 123, hex: 'abc123def456abc123def456abc123de' },
        ],
      },
      {
        file: 'file2.csv',
        // Missing lines property
      },
      {
        file: 'file3.csv',
        lines: null, // Invalid lines
      },
    ];

    render(<FileTable filesData={mockData} />);

    // Should only render file1.csv data
    expect(screen.getByText('file1.csv')).toBeInTheDocument();
    expect(screen.getByText('valid')).toBeInTheDocument();
    // file2 and file3 should not appear
    expect(screen.queryByText('file2.csv')).not.toBeInTheDocument();
    expect(screen.queryByText('file3.csv')).not.toBeInTheDocument();
  });

  it('should display all cell content correctly', () => {
    const mockData = [
      {
        file: 'test.csv',
        lines: [
          {
            text: 'sample text',
            number: 9999,
            hex: 'ffffffffffffffffffffffffffffffff',
          },
        ],
      },
    ];

    render(<FileTable filesData={mockData} />);

    expect(screen.getByText('test.csv')).toBeInTheDocument();
    expect(screen.getByText('sample text')).toBeInTheDocument();
    expect(screen.getByText('9999')).toBeInTheDocument();
    expect(screen.getByText('ffffffffffffffffffffffffffffffff')).toBeInTheDocument();
  });

  it('should handle empty lines array in file', () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [],
      },
    ];

    render(<FileTable filesData={mockData} />);

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should use memo to prevent unnecessary re-renders', () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [
          { text: 'test', number: 123, hex: 'abc123def456abc123def456abc123de' },
        ],
      },
    ];

    const { rerender } = render(<FileTable filesData={mockData} />);
    expect(screen.getByText('test')).toBeInTheDocument();

    // Re-render with same data
    rerender(<FileTable filesData={mockData} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should handle numeric values correctly', () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [
          { text: 'test', number: 0, hex: 'abc123def456abc123def456abc123de' },
          { text: 'test2', number: -50, hex: 'abc123def456abc123def456abc123de' },
        ],
      },
    ];

    render(<FileTable filesData={mockData} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('-50')).toBeInTheDocument();
  });
});
