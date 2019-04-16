import React from "react";
import {Card, Icon, Popconfirm} from "antd";
import '../../css/cardnote.css';
import trash from '../../images/trashcan.png';
import {backendURL} from "../../dependency";
import request from 'request';

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


    displayNoteData(note) {
        this.setState({
            moreNoteData:
                <div>
                    <div>
                        <Icon type="book" theme="filled" style={{'color': "#466fb5"}} />
                        {"  "}
                        {note.category}
                    </div>
                    <div>
                        {note.lastUpdated}
                    </div>
                </div>,
            noteDelete: <img height="40px" width="40px" src={trash} alt={"trash"}/>
        });
    }


    editNote(email, noteID) {
        this.props.history.push({
            pathname: `/note/${noteID}`,
            state: { noteID },
        });
    }

    /**
    * deleteNote
    * Takes the email of a user, and the noteID to a note, and deletes the note
    * Spring 2019
    **/
    deleteNote(email, noteID) {
        // update the front end
        this.props.handleDelete(this.state.note);
        const accessToken = localStorage.getItem('access_token');
        const AuthStr = 'Bearer '.concat(accessToken);
        const headers = { Authorization: AuthStr, 'Content-Type': 'application/x-www-form-urlencoded' };

        const deleteNote = {
            method: 'DELETE',
            url: `${backendURL}/delete-note`,
            qs: { noteID },
            headers: headers,
        };
        request(deleteNote, (error, response, body) => {

            const parsedData = JSON.parse(body);
            this.setState({ notes: parsedData.notes });
        });
    }

    render() {
        return (
            <div className={"card"}>
              <Card
                //Card styling
                style={{ backgroundColor: this.state.note.noteColor, width: 220, marginTop: 16, "borderRadius": "10px 10px 0px 0px", "boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}
                //Card button actions
                actions={[
                  //Edit button
                  <Icon type="edit" onClick={() => this.editNote(localStorage.getItem('email'), this.state.note._id)}/>,
                  //Delete button with Popconfirm
                  <Popconfirm
                  title="Are you sure you want to delete this note?"
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  style={{ color: 'red' }}
                  onConfirm={() => this.deleteNote(localStorage.getItem('email'), this.state.note._id)}
                  okText="Yes"
                  cancelText="No">
                  <Icon type="delete" />
                </Popconfirm>, <Icon type="ellipsis" />]}
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
