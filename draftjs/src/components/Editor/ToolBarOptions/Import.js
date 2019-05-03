import {Button} from "antd";
import React from "react";

const Import = (props) => {
    function Import(noteID, noteHTML, noteColor) {

        //TODO: Implement import function --> https://ant.design/components/upload/ 

        const parsedHTML = "<body>" + noteHTML + "</body>"

    }
    return (
        <Button
            className={"import-doc"}
            icon="upload"
            shape="round"
            size="large"
            onClick={() => Import(props.noteID, props.noteHTML, props.noteColor)}>
            Import 
        </Button>

    );
}

export default Import;