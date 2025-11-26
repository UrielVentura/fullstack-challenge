import React, { memo } from "react";
import { Form } from "react-bootstrap";

const FileFilter = ({ filesList, selectedFile, onFileChange }) => {
  return (
    <Form.Group className='mb-3'>
      <Form.Label>Filter by File Name:</Form.Label>
      <Form.Select
        value={selectedFile || ""}
        onChange={(e) => onFileChange(e.target.value || null)}
      >
        <option value=''>All Files</option>
        {filesList.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default memo(FileFilter);
