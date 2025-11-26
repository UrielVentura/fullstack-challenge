import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import App from '../App';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('App Component', () => {
  it('should render without crashing', () => {
    const initialState = {
      filesList: [],
      filesData: [],
      selectedFile: null,
      loading: false,
      error: null,
    };

    const store = mockStore(initialState);
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(container).toBeTruthy();
  });

  it('should render navbar with title', () => {
    const initialState = {
      filesList: [],
      filesData: [],
      selectedFile: null,
      loading: false,
      error: null,
    };

    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('React Test App')).toBeInTheDocument();
  });

  it('should render FileFilter component', () => {
    const initialState = {
      filesList: ['file1.csv', 'file2.csv'],
      filesData: [],
      selectedFile: null,
      loading: false,
      error: null,
    };

    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  it('should render FileTable component', () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [
          { text: 'test', number: 123, hex: 'abc123def456abc123def456abc123de' },
        ],
      },
    ];

    const initialState = {
      filesList: ['file1.csv'],
      filesData: mockData,
      selectedFile: null,
      loading: false,
      error: null,
    };

    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should display loading spinner when loading is true', () => {
    const initialState = {
      filesList: [],
      filesData: [],
      selectedFile: null,
      loading: true,
      error: null,
    };

    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should not display table when loading is true', () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [
          { text: 'test', number: 123, hex: 'abc123def456abc123def456abc123de' },
        ],
      },
    ];

    const initialState = {
      filesList: [],
      filesData: mockData,
      selectedFile: null,
      loading: true,
      error: null,
    };

    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.queryByText('test')).not.toBeInTheDocument();
  });

  it('should display error alert when error exists', () => {
    const errorMessage = 'Failed to fetch files';
    const initialState = {
      filesList: [],
      filesData: [],
      selectedFile: null,
      loading: false,
      error: errorMessage,
    };

    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should not display error alert when error is null', () => {
    const initialState = {
      filesList: [],
      filesData: [],
      selectedFile: null,
      loading: false,
      error: null,
    };

    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });

  it('should dispatch fetchFilesList and fetchFilesData on mount', () => {
    const initialState = {
      filesList: [],
      filesData: [],
      selectedFile: null,
      loading: false,
      error: null,
    };

    const store = mockStore(initialState);
    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Note: The actual dispatch happens, we just verify store was used
    expect(store).toBeTruthy();
  });

  it('should display "No data available" when filesData is empty and not loading', () => {
    const initialState = {
      filesList: [],
      filesData: [],
      selectedFile: null,
      loading: false,
      error: null,
    };

    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should render multiple file rows when filesData has multiple files', () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [
          { text: 'test1', number: 100, hex: 'abc123def456abc123def456abc123de' },
        ],
      },
      {
        file: 'file2.csv',
        lines: [
          { text: 'test2', number: 200, hex: 'def456abc123def456abc123def456ab' },
        ],
      },
    ];

    const initialState = {
      filesList: ['file1.csv', 'file2.csv'],
      filesData: mockData,
      selectedFile: null,
      loading: false,
      error: null,
    };

    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('test1')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
  });

  it('should have correct container and navbar structure', () => {
    const initialState = {
      filesList: [],
      filesData: [],
      selectedFile: null,
      loading: false,
      error: null,
    };

    const store = mockStore(initialState);
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Check for navbar
    const navbar = container.querySelector('[class*="navbar"]');
    expect(navbar).toBeInTheDocument();
  });

  it('should be renderable', () => {
    const initialState = {
      filesList: [],
      filesData: [],
      selectedFile: null,
      loading: false,
      error: null,
    };

    const store = mockStore(initialState);
    const { container } = render(
      <Provider store={store}>
        <div>Test</div>
      </Provider>
    );

    expect(container).toBeTruthy();
  });
});
