import React, { useCallback, useState, useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { BASE_URL } from './App';

export default function DropAllRelatedFile({ relatedFilesData, onSave }) {
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [loaderFlag, setLoaderFlag] = useState(false);
  useEffect(() => {
    if (relatedFilesData.length > 0 && relatedFiles.length === 0)
      setRelatedFiles(relatedFilesData);
  }, [relatedFilesData]);
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(async (file) => {
      setLoaderFlag(true);
      const body = new FormData();
      const blob = await fetch(await toBase64(file)).then((res) => res.blob());
      body.append('image', blob, file.name);
      body.append('description', 'operating manual');
      body.append('title', 'related_files');
      body.append('uploadedBy', 'vaibhavi');
      var myHeaders = new Headers();
      myHeaders.append('role', 'admin');
      fetch(`${BASE_URL}/uploads/uiFiles`, {
        method: 'post',
        body: body,
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          setRelatedFiles((prevState) => [
            ...prevState,
            { name: file.name, url: res.url },
          ]);
          setLoaderFlag(false);
        });
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 5,
    multiple: true,
  });

  const handleFileDelete = (file) => {
    let temp = [...relatedFiles];
    temp.splice(temp.indexOf(file), 1);
    setRelatedFiles(temp);
  };

  useEffect(() => {
    onSave(relatedFiles);
  }, [relatedFiles]);

  console.log("THE SIZE OF FILE",relatedFiles,relatedFiles.length)

  return (
    <>
      {console.log('props---->', relatedFiles)}
      {relatedFiles.length > 0 && (
        <Row>
          {relatedFiles.map((file, index) => (
            <Col sm={6}>
              <div className="upload_related_box">
                <div className="forms-content create-other" style={{"border-bottom":"none"}}>
                  <div className="content-icon-section">
                    <img
                      src={
                        file.name.includes('.docx')
                          ? '../img/doc_blue.svg'
                          : file.name.includes('.pptx')
                          ? '../img/doc_pptx.svg'
                          : '../img/doc_blue.svg'
                      }
                    />
                  </div>
                  <div className="content-title-section">
                    <h6>{file.name}</h6>
                    {/* <h4>3 Hours</h4> */}
                  </div>
                </div>
                <Button
                  variant="link"
                  onClick={() => {
                    handleFileDelete(file);
                  }}
                >
                  <img src="../../img/removeIcon.svg" />
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}
      <div className="file-upload-form">
        <div {...getRootProps({ className: 'dropzone' })} style={{ width: "150px" }}> 
          <input {...getInputProps()} />
          <span className="text-center uploadfile">
            <img
              src={
                loaderFlag
                  ? '../img/mini_loader.gif'
                  : '../img/bi_cloud-upload.png'
              }
              className="me-2"
              alt=""
            />{' '}
            Add Files
          </span>
        </div>
      </div>
    </>
  );
}
