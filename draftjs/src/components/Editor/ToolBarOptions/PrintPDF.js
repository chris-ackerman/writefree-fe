import {Button} from "antd";
import React from "react";
import ReactToPrint from 'react-to-print';
import axios from "axios";
import {backendURL} from "../../../dependency";

const PrintPDF = (props) => {
    function printPDF(noteID, noteHTML, noteColor) {

        const parsedHTML = `<body style="background-color: ${noteColor};" >` + noteHTML + "</body>"

        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.bgColor = noteColor;
        pri.document.write(parsedHTML);
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