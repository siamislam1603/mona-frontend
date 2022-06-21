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

  return (
    <div className="App">
      {props.operatingManual.description && (
        <CKEditor
          config={{
            extraPlugins: [uploadPlugin],
            rows: 5,
          }}
          data={props.operatingManual.description}
          editor={ClassicEditor}
          onChange={(event, editor) => {
            props.handleChange('description', editor.getData());
          }}
          {...props}
        />
      )}
      <p className="form-errors">{props.errors.description}</p>
    </div>
  );
}
