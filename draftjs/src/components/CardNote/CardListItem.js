import React from "react";
import {Card, Icon, Popconfirm} from "antd";
import '../../css/cardnote.css';
import("antd/dist/antd.css").then(() => import("../../css/card-list-item.css"));

const { Meta } = Card;

class CardListItem extends React.Component {
    constructor(props) {
        super(props);
        console.log("PROPS", props)
        this.state = {
            noteTitle: props.note.title,
            note: props.note,
        };
    }

    /**
    * editNote
    * Takes the noteID to a note, and brings the user to the edit page for the note
    * Spring 2019
    **/
    editNote(noteID) {
        this.props.goToNote(noteID);
    }

    /**
    * deleteNote
    * Takes the noteID to a note, and deletes the note
    * Spring 2019
    **/
    deleteNote(note) {
      this.props.handleDelete(note);
    }

    /**
    * ConvertNoteToPDF
    * Takes the noteID to a the PDF version of the note 
    * Spring 2019
    **/
    // pdfNote(note) {
    //   this.props.goToNote(noteID);
    // }

    render() {
        return (
            <div className={"card"}>
              <Card
                //Card styling
                style={{ backgroundColor: this.state.note.noteColor }}
                //Card button actions
                actions={[
                  //Edit button
                  <Icon type="edit" onClick={() => this.editNote(this.state.note._id)}/>,
                  //Delete button with Popconfirm
                  <Popconfirm
                  title="Are you sure you want to delete this note?"
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  style={{ color: 'red' }}
                  onConfirm={() => this.deleteNote(this.state.note)}
                  okText="Yes"
                  cancelText="No">
                  <Icon type="delete" />
                 </Popconfirm>, 
                  //Export Note to PDF 
                 <Icon type="download" onClick={() => this.pdfNote(this.state.note._id)}/>,
                 <Icon type="ellipsis"/>]}
              >
                <Meta
                  title={this.state.noteTitle}
                  description={this.state.note.lastUpdated}
                />
              </Card>
            </div>
        );
    }
}

export default CardListItem;
