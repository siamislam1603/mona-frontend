import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

const bytesToMegaBytes = (bytes) => bytes / 1024 ** 2;

function fileSizeValidator(file) {
  let fileType = file.type.split('/')[0];

  if (fileType === 'video') {
    let fileSize = bytesToMegaBytes(file.size);
    if (fileSize > 1024) {
      return {
        code: 'file-too-large',
        message: `File should be less than ${1}GB`,
      };
    }
  } else if (fileType === 'application') {
    let fileSize = bytesToMegaBytes(file.size);
    if (fileSize > 20) {
      return {
        code: 'file-too-large',
        message: `File should be less than ${20}MB`,
      };
    }
  } else if (fileType === 'image') {
    let fileSize = bytesToMegaBytes(file.size);
    if (fileSize > 20) {
      return {
        code: 'file-too-large',
        message: `Image should be less than ${20}MB`,
      };
    }
  }

  return null;
}

export default function DropAllFile({
  onSave,
  Files,
  setErrors,
  title = 'Files',
  type = 'file',
  module = 'usual',
  fileLimit = 20,
  supportFormDetails = null,
  setUploadError = () => {},
  videoUrl,
  setVideoThumbnailUrl,
  setVideoUrl,
}) {
  let typeObj;

  if (type === 'video') {
    typeObj = {
      'video/*': ['.mp4', '.mkv'],
    };
  } else {
    typeObj = {
      'text/*': [
        '.pdf',
        '.doc',
        '.xlsx',
        '.xlsm',
        '.docx',
        '.ppt',
        '.ods',
        '.pptx',
        '.xls',
        '.html',
        '.htm',
        '.txt',
        '.csv',
      ],
      'image/png': ['.png', '.jpg', '.jpeg'],
    };
  }

  const [data, setData] = useState([]);
  const [theFiles, setTheFiles] = useState();
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach((file) => {
      setData((prevState) => [...prevState, file]);
    });
  }, []);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    maxFiles: fileLimit,
    multiple: fileLimit === 1 ? false : true,
    accept: typeObj,
    validator: fileSizeValidator,
  });

  const handleFileDelete = (file) => {
    let temp = [...data];

    temp.splice(temp.indexOf(file), 1);
    setData(temp);
  };

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  const handleDelete = (file) => {
    let temp = [...theFiles];
    temp.splice(temp.indexOf(file), 1);
    setTheFiles(temp);

    if (theFiles.length < 2) {
      setTheFiles(null);
    }
  };

  useEffect(() => {
    onSave(data);
  }, [data]);

  useEffect(() => {
    setTheFiles(Files);
  }, [Files]);

  useEffect(() => {
    if (supportFormDetails) {
      setData([]);
    }
  }, [supportFormDetails]);

  // Setting Errors
  useEffect(() => {
    let rejectionArray = fileRejections.map((d) => ({
      error: d.errors.map((e) => e),
    }));
    setUploadError(rejectionArray);
  }, [fileRejections]);

  const getRelatedFileName = (str) => {
    let arr = str.split('/');
    let fileName = arr[arr.length - 1].split('_')[0];
    let ext = arr[arr.length - 1].split('.')[1];
    let name = fileName.concat('.', ext);
    return name;
  };

  return (
    <div className="file-upload-form">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <span className="text-center uploadfile cursor">
          <img src="../img/bi_cloud-upload.png" className="me-2" alt="" />{' '}
          {module === 'user-management' ? 'Upload' : 'Add'} {title}
        </span>
        {type === 'video' ? (
          <div style={{ marginTop: '5px' }}>
            <small className="fileinput">(mp4 & mkv)</small>
            <small className="fileinput">
              (max. 5 video files, less than 1GB each)
            </small>
          </div>
        ) : (
          <div style={{ marginTop: '5px' }}>
            <small className="fileinput">
              (pdf, doc, ppt, xlsx, images and other documents)
            </small>
            <small className="fileinput">
              (max. 20 documents, less than 20MB each)
            </small>
          </div>
        )}
      </div>

      {theFiles ? (
        <div className="showfiles">
          <ul>
            {theFiles.map((file, index) => (
              <li className="mt-3" key={index}>
                <p>{file.path}</p>
                {getRelatedFileName(file.file)}
                <span className="ms-2">
                  <ul>{fileRejectionItems}</ul>
                  <Link to="#" onClick={() => handleDelete(file)}>
                    <img src="../img/removeIcon.svg" alt="" />
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="showfiles">
          <ul>
            {data &&
              data?.map((file, index) => (
                <li className="mt-1" key={index}>
                  {file.path}
                  {/* {file.path} - {file.size} bytes */}
                  <span className="ms-2">
                    <Link to="#" onClick={() => handleFileDelete(file)}>
                      <img src="../img/removeIcon.svg" alt="" />
                    </Link>
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
      {/* <div className="showfiles">
        <ul>
          {
            data.map((file, index) => (
              <li className="mt-3" key={index}>
                {file.path}
                <span className="ms-2">
                  <Link to="#" onClick={() => handleFileDelete(file)}>
                      <img src="../img/removeIcon.svg" alt="" />
                  </Link>
                </span>
              </li>
            ))
          }
        </ul>
      </div> */}
    </div>
  );
}
