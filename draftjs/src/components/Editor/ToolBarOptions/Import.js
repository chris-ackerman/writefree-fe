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

    }
    return (
        <Button
            className={"import-doc", "convert-to-pdf"}
            icon="upload"
            shape="round"
            size="large"
            onClick={() => Import(props.noteID, props.noteHTML, props.noteColor)}>
            Import 
        </Button>

    );
}

export default Import;