import {Button} from "antd";
import React from "react";
import {backendURL} from "../../../dependency";

const PrintPDF = (props) => {
    function printPDF(noteID, noteHTML, noteColor) {

        const parsedHTML = "<body>" + noteHTML + "</body>"

        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(parsedHTML);
        pri.document.body.style.backgroundColor = noteColor;
        //pri.document.body.style.-webkit-print-color-adjust: "exact";
        pri.document.close();
        pri.focus();
        pri.print();

    }
    return (
        <Button
            className={"convert-to-pdf"}
            icon="download"
            shape="round"
            size="large"
            onClick={() => printPDF(props.noteID, props.noteHTML, props.noteColor)}>
            Print 
        </Button>
    );
}

export default PrintPDF;