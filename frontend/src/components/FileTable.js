import React, { useMemo } from "react";
import { Table } from "react-bootstrap";

const FilesTable = ({ filesData = [] }) => {
  // Memoizar el flatten para evitar re-cálculos innecesarios
  const flattenedData = useMemo(() => {
    const result = [];
    if (!filesData || !Array.isArray(filesData)) {
      return result;
    }
    filesData.forEach((file) => {
      if (file && file.lines && Array.isArray(file.lines)) {
        file.lines.forEach((line) => {
          result.push({
            fileName: file.file,
            ...line,
          });
        });
      }
    });
    return result;
  }, [filesData]);

  if (flattenedData.length === 0) {
    return (
      <div className='text-center my-5'>
        <p className='text-muted'>No data available</p>
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Text</th>
          <th>Number</th>
          <th>Hex</th>
        </tr>
      </thead>
      <tbody>
        {flattenedData.map((row, index) => (
          <tr key={`${row.fileName}-${index}`}>
            <td>{row.fileName}</td>
            <td>{row.text}</td>
            <td>{row.number}</td>
            <td>{row.hex}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default FilesTable;
