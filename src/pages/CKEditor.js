import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function MyEditor(props) {
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("image", file);
            body.append("description", "sample image");
            body.append("title", "image");
            body.append("uploadedBy", "vaibhavi");
            var myHeaders = new Headers();
            myHeaders.append("role", "admin");
            fetch(
              `https://766a-2409-4053-2e07-4723-f958-1c8c-a080-1a86.in.ngrok.io/uploads/uiFiles`,
              {
                method: "post",
                body: body,
                headers: myHeaders
              }
            )
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
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }
  return (
    <div className="App">
      <CKEditor
        config={{
          extraPlugins: [uploadPlugin],
        }}
        editor={ClassicEditor}
        onChange={(event, editor) => {
          props.handleChange("answer", editor.getData());
        }}
        {...props}
      />
    </div>
  );
}
