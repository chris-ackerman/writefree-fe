/* eslint-disable */
import React from 'react';
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { withRouter } from 'react-router-dom';
import { Input, Button, Icon } from 'antd';
import request from 'request';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../css/note.css';
import 'antd/dist/antd.css';
import NavigationBar from "../NavigationBar";
import ConvertToPDF from "./ToolBarOptions/ConvertToPDF";
import PrintPDF from "./ToolBarOptions/PrintPDF";
import HyphenationOption from "./ToolBarOptions/Hyphenation";
import NoteColor from "./ToolBarOptions/NoteColor";
import SpeechOption from "./ToolBarOptions/TextToSpeech";
import WordSpacingOption from "./ToolBarOptions/WordSpacing";
import LineSpacingOption from "./ToolBarOptions/LineSpacing";
import {stateToHTML} from 'draft-js-export-html';
import ReactGA from 'react-ga';
import Responsive from 'react-responsive';
import {backendURL} from "../../dependency";
import axios from "axios";
const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={767} />;
const Default = props => <Responsive {...props} minWidth={768} />;

function changeGaPage(path) {
    ReactGA.pageview(path);
    console.log("changed path to: ", path);
}

class Note extends React.Component {
  constructor(props) {
    super(props);
    changeGaPage(props.location.pathname);
    const splitValue = window.location.href.split("/")
    const noteID = splitValue[splitValue.length - 1]
    this.state = {
      editorState: EditorState.createEmpty(),
      noteCategory: undefined,
      noteTitle: undefined,
      noteID : noteID,
        noteCategoryIconColor: undefined,
        toolsButtonHighlight: {'backgroundColor': '#466fb5', 'color': 'white', isSelected: true, 'maxWidth' : '100px'},
        noteSettingsButtonHighlight: {'border': 'none', isSelected: false,  'maxWidth' : '100px','color' : 'white'}
    };
    hyphenate = hyphenate.bind(this);
    changeNoteColor = changeNoteColor.bind(this);
    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => this.setState({ editorState });
    this.handleKeyCommand = command => this._handleKeyCommand(command);
    this.changeToolBar = this.changeToolBar.bind(this);
  }
  componentDidMount() {
      if (!localStorage.getItem('id')){
          return this.props.history.push('/login')
      }
      // const splitValue = window.location.href.split("/")
      // const noteID = splitValue[splitValue.length - 1]
      const accessToken = localStorage.getItem('access_token');
      const AuthStr = 'Bearer '.concat(accessToken);
      const headers = { Authorization: AuthStr, 'Content-Type': 'application/x-www-form-urlencoded' };
      const noteID = this.state.noteID
    const fetchNote = {
      method: 'GET',
      url: `${backendURL}/fetch-note/${String(this.state.noteID)}`,
      qs: { noteID },
      headers: headers,
    };
    request(fetchNote, function (error, response, body) {
        if (response.statusCode === 404){
            return this.props.history.push('/error404')
        }
        var parsedData = JSON.parse(body);
        // console.log("settings : " + parsedData.noteSettings);
        if (parsedData.noteSettings){
            setDocumentWordSpacing(parsedData.wordSpacing);
            setDocumentLineSpacing(parsedData.lineSpacing);
            let contentState = parsedData.noteSettings;
            this.setState({
                editorState: EditorState.createWithContent(convertFromRaw((contentState))),
                noteColor: parsedData.noteColor,
                wordSpacing: parsedData.wordSpacing,
                lineSpacing: parsedData.lineSpacing,
                noteID: noteID,
                isHyphenated: parsedData.isHyphenated
            });
        }
        // this.setState({
        //     noteID : noteID
        // });
        console.log("id : " + this.state.noteID);

        if (parsedData.title){
            let contentState = parsedData.content;
            this.setState({
                editorState: EditorState.createWithContent(convertFromRaw((contentState))),
                noteTitle: parsedData.title,
                noteCategory: parsedData.category,
                noteCategoryIconColor: "#466fb5",
                noteColor: parsedData.noteColor,
            });
        }
    }.bind(this));
  }

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    async saveNote(title, category, noteID, noteContent){
        const convertedNoteContent = convertToRaw(noteContent)
        const accessToken = localStorage.getItem('access_token');
        const AuthStr = 'Bearer '.concat(accessToken);
        const headers = { Authorization: AuthStr, 'Content-Type': 'application/x-www-form-urlencoded' };

        const obj = {title, category, noteID, noteContent: convertedNoteContent}
        var saveNote = {
            method: 'POST',
            url: backendURL + '/save-note',
            body: JSON.stringify(obj),
            headers: headers,
        };
        return await request(saveNote)
    }


    speechNote(noteContent){
        var text = '';
        for (var line in noteContent.blocks){
            text = text + (noteContent.blocks[line].text) + ". "
        }
        return text
    }

    changeToolBar(key){
        if (key === "tools"){
            this.setState({
                toolsButtonHighlight: {'backgroundColor': '#466fb5', 'color': 'white', isSelected: true, 'maxWidth' : '100px'},
                noteSettingsButtonHighlight: {'border': 'none', isSelected: false, 'maxWidth' : '100px'},
                'toolbar': {}, 'toolbarCustomButtons': []
            })
        }
        else if (key === "noteSettings") {
            this.setState({
                noteSettingsButtonHighlight: {'backgroundColor': '#466fb5', 'color': 'white', isSelected: true, 'maxWidth' : '100px'},
                toolsButtonHighlight: {'border': 'none', isSelected: false, 'maxWidth' : '100px'},
                'toolbar': {'options': []},
                'toolbarCustomButtons': [
                    <HyphenationOption hyphenate={hyphenate} noteID={this.state.noteID} isHyphenated={this.state.isHyphenated}/>,
                    <WordSpacingOption setDocumentWordSpacing={setDocumentWordSpacing} noteID={this.state.noteID} wordSpacing={this.state.wordSpacing}/>,
                    <LineSpacingOption setDocumentLineSpacing={setDocumentLineSpacing} noteID={this.state.noteID} lineSpacing={this.state.lineSpacing}/>,
                    <SpeechOption speechText={convertToRaw(this.state.editorState.getCurrentContent())}/>,
                    <NoteColor changeNoteColor ={changeNoteColor} noteID={this.state.noteID} noteColor={this.state.noteColor}/>]
            })
        }
    }

    changeNoteCategory(noteCategory){
        if(noteCategory){
            this.setState({noteCategory, noteCategoryIconColor: "#466fb5"})
        } else {
            this.setState({noteCategory, noteCategoryIconColor: "gray"})
        }

    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
        }
    };

    showSelectedButton(buttonType){
      if (buttonType === "tools"){
          if (!this.state.toolsButtonHighlight.isSelected){
              this.setState({'toolsButtonHighlight': {'backgroundColor': '#466fb5', 'color': 'white', isSelected: false, 'maxWidth' : '100px'}})
          }
      }
        if (buttonType === "noteSettings"){
            if (!this.state.noteSettingsButtonHighlight.isSelected){
                this.setState({'noteSettingsButtonHighlight': {'backgroundColor': '#466fb5', 'color': 'white', isSelected: false, 'maxWidth' : '100px'}})
            }
        }

    }

    hideSelectedButton(buttonType){
        if (buttonType === "tools"){
            if (!this.state.toolsButtonHighlight.isSelected){
                this.setState({'toolsButtonHighlight': {'border': 'none', isSelected: false, 'maxWidth' : '100px'}})
            }
        }
        if (buttonType === "noteSettings"){
            if (!this.state.noteSettingsButtonHighlight.isSelected){
                this.setState({'noteSettingsButtonHighlight': {'border': 'none', isSelected: false, 'maxWidth' : '100px'}})
            }

        }

    }

    alwaysSaveNote(){
        if (this.state.noteTitle && this.state.noteCategory){
            this.saveNote(this.state.noteTitle, this.state.noteCategory, this.state.noteID, this.state.editorState.getCurrentContent())
        } else if (!this.state.noteTitle && !this.state.noteCategory) {
            this.saveNote("Untitled", "N/A", this.state.noteID, this.state.editorState.getCurrentContent())
        } else if (!this.state.noteCategory) {
            this.saveNote(this.state.noteTitle, "N/A", this.state.noteID, this.state.editorState.getCurrentContent())
        } else if (!this.state.noteTitle) {
            this.saveNote("Untitled", this.state.noteCategory, this.state.noteID, this.state.editorState.getCurrentContent())
        }

    }

    render() {
        const {editorState} = this.state;
        document.body.style.backgroundColor = "#f5f5f5"
        this.alwaysSaveNote()
        return (
            <div style={{background: "#f5f5f5"}}>
                <NavigationBar/>
                <div className={"add-title"}>
                <Default>
                    <Input className={"enter-title-here"} placeholder={"Untitled"} onKeyPress={this._handleKeyPress} value={this.state.noteTitle} onChange={noteTitle => this.setState({noteTitle: noteTitle.target.value})}></Input>
                    <Icon type="book" theme="filled" style={{'color': this.state.noteCategoryIconColor}} className={"note-category-icon"} />
                    <Input className={"enter-category-here"} placeholder={"Category"} value={this.state.noteCategory} onChange={noteCategory => this.changeNoteCategory(noteCategory.target.value)}></Input>
                    <ConvertToPDF noteID={this.state.noteID} noteHTML={stateToHTML(this.state.editorState.getCurrentContent())} noteColor={this.state.noteColor}/>
                    <PrintPDF noteID={this.state.noteID} noteHTML={stateToHTML(this.state.editorState.getCurrentContent())} noteColor={this.state.noteColor}/>
                </Default>
                <Mobile>
                    <Input className={"enter-title-here"} placeholder={"Untitled"} onKeyPress={this._handleKeyPress} value={this.state.noteTitle} onChange={noteTitle => this.setState({noteTitle: noteTitle.target.value})}></Input>
                    <div style={{'paddingTop':10}}>
                    <Icon type="book" theme="filled" style={{'color': this.state.noteCategoryIconColor}} className={"note-category-icon"} />
                    <Input className={"enter-category-here"} placeholder={"Category"} value={this.state.noteCategory} onChange={noteCategory => this.changeNoteCategory(noteCategory.target.value)}></Input>
                    </div>
                    <ConvertToPDF noteID={this.state.noteID} noteHTML={stateToHTML(this.state.editorState.getCurrentContent())} noteColor={this.state.noteColor}/>
                    <PrintPDF noteID={this.state.noteID} noteHTML={stateToHTML(this.state.editorState.getCurrentContent())} noteColor={this.state.noteColor}/>
                </Mobile>
                </div>
                <div className={"tab-bar"}>
                    <Button
                        style={this.state.toolsButtonHighlight}
                        className={"tab-buttons"}
                        onMouseEnter={() => this.showSelectedButton("tools")}
                        onMouseLeave={() => this.hideSelectedButton("tools")}
                        onClick={() => this.changeToolBar("tools")}>
                        Tools
                    </Button>
                    <Button
                        style={this.state.noteSettingsButtonHighlight}
                        className={"tab-buttons"}
                        onMouseEnter={() => this.showSelectedButton("noteSettings")}
                        onMouseLeave={() => this.hideSelectedButton("noteSettings")}
                        onClick={() => this.changeToolBar("noteSettings")}>
                        Settings
                    </Button>
                </div>

            <div className="RichEditor-root" id={"textEdiotr"}>
                <Editor
                    spellCheck={true}
                    editorState={editorState}
                    toolbarClassName="rdw-storybook-toolbar"
                    wrapperStyle={{background: "#f5f5f5"}}
                    editorStyle={{backgroundColor: this.state.noteColor}}
                    onEditorStateChange={this.onChange}
                    toolbarCustomButtons={this.state.toolbarCustomButtons}
                    toolbar={this.state.toolbar}
                />
                <iframe id="ifmcontentstoprint" style= {{height:"0px", width:"0px", position:"absolute"}}></iframe>
            </div>
                <br/>
            </div>
        );
    }
}

function setDocumentWordSpacing(wordSpacing) {
    var textfiled = document.getElementsByClassName('DraftEditor-root');
    textfiled[0].style.wordSpacing = wordSpacing;
}

function setDocumentLineSpacing(lineSpacing) {
    var textfiled = document.getElementsByClassName('DraftEditor-root');
    textfiled[0].style.lineHeight = lineSpacing;
}

// Function for hyphenating the contents in text editor, binded with Note class.
function hyphenate(child, noteID) {
    const postHyphenateChild = {
        method: 'POST',
        url: 'https://writefree-backend.herokuapp.com/change-hyphenation',
        body: JSON.stringify({ noteID: noteID, isHyphenated: child }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    if (child) {
        var newContents = convertToRaw(this.state.editorState.getCurrentContent());
        console.log(newContents)
        var Hypher = require('hypher'),
            english = require('hyphenation.en-us'),
            h = new Hypher(english);
        for (var line = 0; line < newContents.blocks.length; line++) {
            //counts the number of dots added
            var numberOfDots = 0;
            //parse the line into words by spaces
            var oneLine = newContents.blocks[line]['text'].split(" ");
            var hyphenatedLine = "";
            //hyphenate each work
            for (var i = 0; i < oneLine.length; i++) {
                var hyphenatedWord = h.hyphenate(oneLine[i]);
                for (var j = 0; j < hyphenatedWord.length - 1; j++) {
                    // add unicode dot for each syllables
                    hyphenatedLine += hyphenatedWord[j] + "\u2022";
                    numberOfDots += 1;
                }
                hyphenatedLine += hyphenatedWord[hyphenatedWord.length - 1] + " ";
            }
            newContents.blocks[line]['text'] = hyphenatedLine;
            //change inline css style for the extra dot characters
            newContents.blocks[line]['inlineStyleRanges'][0]['length'] += numberOfDots;
            newContents.blocks[line]['inlineStyleRanges'][1]['length'] += numberOfDots;
        }
        request(postHyphenateChild, (error, response, body) => {
            this.setState({
                isHyphenated: child,
                editorState: EditorState.createWithContent(convertFromRaw((newContents))),
            });
        });

    }
    //eliminate the splitter
    else { //hyphenate is off
        var newContents = convertToRaw(this.state.editorState.getCurrentContent());
        // go through each blocks/lines
        for (var line = 0; line < newContents.blocks.length; line++) {
            //parse the line into pieces splited by the dots
            var oneLine = newContents.blocks[line]['text'].split("\u2022");
            //counts the number of dots eliminated
            var numberOfDots = oneLine.length - 1;
            var restoredLine = "";
            //hyphenate each work
            for (var i = 0; i < oneLine.length; i++) {
                restoredLine += oneLine[i];
            }
            newContents.blocks[line]['text'] = restoredLine;
            //change inline css style for the extra dot characters
            newContents.blocks[line]['inlineStyleRanges'][0]['length'] -= numberOfDots;
            newContents.blocks[line]['inlineStyleRanges'][1]['length'] -= numberOfDots;
        }


        request(postHyphenateChild, (error, response, body) => {
            this.setState({
                isHyphenated: child,
                editorState: EditorState.createWithContent(convertFromRaw((newContents))),
            });
        });
    }
}

// Function for changing the note background color. Store the changes to database
function changeNoteColor(noteID, color) {
    var changeNoteColor = {
        method: 'POST',
        //url: 'http://127.0.0.1:5000/change-note-color',
        url: 'https://writefree-backend.herokuapp.com/change-note-color',
        //url:'${backendURL}/change-note-color',
        qs: {noteID, noteColor: color.hex},
        headers: {'Content-Type': 'application/x-www-form-urlencoded' }
    };
    request(changeNoteColor, function (error, response, body) {
        this.setState({ noteColor: color.hex });
        location.reload();
    }.bind(this));
}

export default withRouter(Note);
