import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Alert, Spinner, Navbar } from "react-bootstrap";
import {
  fetchFilesList,
  fetchFilesData,
  setSelectedFile,
} from "./redux/actions";
import FileFilter from "./components/FileFilter";
import FileTable from "./components/FileTable";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const dispatch = useDispatch();
  const { filesList, filesData, selectedFile, loading, error } = useSelector(
    (state) => state
  );

  useEffect(() => {
    // Fetch files list on component mount
    dispatch(fetchFilesList());
    // Fetch all files data initially
    dispatch(fetchFilesData());
  }, [dispatch]);

  // Memoizar handler para evitar re-renders en componentes hijos
  const handleFileChange = useCallback(
    (fileName) => {
      dispatch(setSelectedFile(fileName));
      dispatch(fetchFilesData(fileName));
    },
    [dispatch]
  );

  return (
    <>
      <Navbar bg='danger' variant='dark'>
        <Container>
          <Navbar.Brand>React Test App</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className='mt-4'>
        {error && (
          <Alert variant='danger'>
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        <FileFilter
          filesList={filesList}
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
        />

        {loading ? (
          <div className='text-center my-5'>
            <Spinner animation='border' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          </div>
        ) : (
          <FileTable filesData={filesData} />
        )}
      </Container>
    </>
  );
}

export default App;
