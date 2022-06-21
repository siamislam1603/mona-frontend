import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

export default function DropAllFile({ onSave }) {
  
  const [data, setData] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      setData(prevState => [...prevState, file]);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 5,
    multiple: true,
  });

  const handleFileDelete = (file) => {
    let temp = [...data];
    temp.splice(temp.indexOf(file), 1);
    setData(temp);
  }

  useEffect(() => {
    onSave(data);
  }, [data]);

  return (
    <div className="file-upload-form mt-3">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <span className="text-center uploadfile">
          <img src="../img/bi_cloud-upload.png" className="me-2" alt="" /> Add
          Files
        </span>
      </div>

      <div className="showfiles">
        <ul>
          {
            data.map((file, index) => (
              <li className="mt-3" key={index}>
                {file.path} - {file.size} bytes
                <span className="ms-2">
                  <Link to="#" onClick={() => handleFileDelete(file)}>
                      <img src="../img/removeIcon.svg" alt="" />
                  </Link>
                </span>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}
