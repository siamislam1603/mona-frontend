import React, { useEffect, useMemo, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BASE_URL } from '../components/App';

export default function MyEditor(props) {
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append('image', file);
            body.append('description', 'sample image');
            body.append('title', 'image');
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
                resolve({
                  default: res.url,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }
  // console.log("THe ERRORS",props.errors)

  return (
    <div className="App">
      {props?.operatingManual ? (
        <CKEditor
          // editor={ClassicEditor}
          config={{
            extraPlugins: [uploadPlugin],
            rows: 5,
            toolbar: {
              items: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'link',
                  'bulletedList',
                  'numberedList',
                  '|',
                  'outdent',
                  'indent',
                  '|',
                  'uploadImage',
                  'blockQuote',
                  'insertTable',
                  'undo',
                  'redo',
              ]
          }

            // removePlugins: ['Image'], 
          }}
          data={props?.operatingManual?.description}
         
          onChange={(event, editor) => {
            props.handleChange(props.name, editor.getData());
          }}
          {...props}
        />
      ) : (
        <CKEditor
          config={{
            extraPlugins: [uploadPlugin],
            rows: 5,
            toolbar: {
              items: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'link',
                  'bulletedList',
                  'numberedList',
                  '|',
                  'outdent',
                  'indent',
                  '|',
                  'blockQuote',
                  'insertTable',
                  'undo',
                  'redo',
              ]
            }
          }}
          
          editor={ClassicEditor}
          onChange={(event, editor) => {
            props.handleChange(props.name, editor.getData());
          }}
          {...props}
        />
      )}
      <p className="form-errors">{props.errors.description}</p>
    </div>
  );
}
