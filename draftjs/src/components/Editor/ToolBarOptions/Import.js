import {Button} from "antd";
import React from "react";

const Import = (props) => {
    function Import(noteID, noteHTML, noteColor) {

        const parsedHTML = "<body>" + noteHTML + "</body>"

        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(parsedHTML);
        pri.document.body.style.backgroundColor = noteColor;
        pri.document.close();
        pri.focus();
        pri.print();

        const { Upload, message, Button, Icon, } = antd;

const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

ReactDOM.render(
  <Upload {...props}>
    <Button>
      <Icon type="upload" /> Click to Upload
    </Button>
  </Upload>,
  mountNode
);

    }
    return (
        <Upload {...props}>
        <Button
            className={"import-doc"}
            icon="upload"
            shape="round"
            size="large"
            onClick={() => Import(props.noteID, props.noteHTML, props.noteColor)}>
            Import 
        </Button>
        </Upload>,
  mountNode

    );
}

export default Import;