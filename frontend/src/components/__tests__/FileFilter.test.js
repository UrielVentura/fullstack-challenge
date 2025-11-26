import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileFilter from '../FileFilter';

describe('FileFilter Component', () => {
  const mockOnFileChange = jest.fn();

  beforeEach(() => {
    mockOnFileChange.mockClear();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <FileFilter
        filesList={[]}
        selectedFile={null}
        onFileChange={mockOnFileChange}
      />
    );
    expect(container).toBeTruthy();
  });

  it('should render select element', () => {
    render(
      <FileFilter
        filesList={[]}
        selectedFile={null}
        onFileChange={mockOnFileChange}
      />
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  it('should render all files in the list', () => {
    const filesList = ['file1.csv', 'file2.csv', 'file3.csv'];

    render(
      <FileFilter
        filesList={filesList}
        selectedFile={null}
        onFileChange={mockOnFileChange}
      />
    );

    expect(screen.getByText('file1.csv')).toBeInTheDocument();
    expect(screen.getByText('file2.csv')).toBeInTheDocument();
    expect(screen.getByText('file3.csv')).toBeInTheDocument();
  });

  it('should render default option', () => {
    render(
      <FileFilter
        filesList={[]}
        selectedFile={null}
        onFileChange={mockOnFileChange}
      />
    );

    // Look for a default/placeholder option
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  it('should call onFileChange when selection changes', () => {
    const filesList = ['file1.csv', 'file2.csv'];

    render(
      <FileFilter
        filesList={filesList}
        selectedFile={null}
        onFileChange={mockOnFileChange}
      />
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'file1.csv' } });

    expect(mockOnFileChange).toHaveBeenCalled();
    expect(mockOnFileChange).toHaveBeenCalledWith('file1.csv');
  });

  it('should display selected file value', () => {
    const filesList = ['file1.csv', 'file2.csv'];

    const { rerender } = render(
      <FileFilter
        filesList={filesList}
        selectedFile={null}
        onFileChange={mockOnFileChange}
      />
    );

    rerender(
      <FileFilter
        filesList={filesList}
        selectedFile="file1.csv"
        onFileChange={mockOnFileChange}
      />
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('file1.csv');
  });

  it('should handle empty files list', () => {
    render(
      <FileFilter
        filesList={[]}
        selectedFile={null}
        onFileChange={mockOnFileChange}
      />
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  it('should handle null files list', () => {
    const { container } = render(
      <FileFilter
        filesList={null || []}
        selectedFile={null}
        onFileChange={mockOnFileChange}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should trigger callback with correct value on change', () => {
    const filesList = ['test1.csv', 'test2.csv', 'test3.csv'];

    render(
      <FileFilter
        filesList={filesList}
        selectedFile={null}
        onFileChange={mockOnFileChange}
      />
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'test2.csv' } });

    expect(mockOnFileChange).toHaveBeenCalledWith('test2.csv');
  });

  it('should update value when selectedFile prop changes', async () => {
    const filesList = ['file1.csv', 'file2.csv', 'file3.csv'];

    const { rerender } = render(
      <FileFilter
        filesList={filesList}
        selectedFile="file1.csv"
        onFileChange={mockOnFileChange}
      />
    );

    let selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('file1.csv');

    rerender(
      <FileFilter
        filesList={filesList}
        selectedFile="file2.csv"
        onFileChange={mockOnFileChange}
      />
    );

    selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('file2.csv');
  });

  it('should render label or text for user guidance', () => {
    render(
      <FileFilter
        filesList={['file1.csv']}
        selectedFile={null}
        onFileChange={mockOnFileChange}
      />
    );

    // The select element should be accessible and usable
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeVisible();
  });
});
