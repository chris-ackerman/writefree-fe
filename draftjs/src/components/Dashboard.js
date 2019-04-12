/* eslint-disable */
import React from 'react';
import { Table, Button, Switch, Input, Menu, Dropdown, Icon, Popconfirm } from 'antd';
import { Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import request from 'request';
import axios from 'axios';
import Walkthrough from './Walkthrough';
import CardNote from './CardNote/CardNote';
import NavigationBar from './NavigationBar';
import '../css/dashboard.css';
import { mergeSort } from '../defaults/constants';
import {backendURL} from "../dependency";
import ReactGA from 'react-ga';
import { Navbar,Form,Nav,FormControl,NavDropdown } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import Responsive from 'react-responsive';
import Constants from './Configuration'
const Desktop = props => <Responsive {...props} minWidth={Constants.MIN_WIDTH_DESKTOP} />;
const Tablet = props => <Responsive {...props} minWidth={Constants.MIN_WIDTH_TABLET} maxWidth={Constants.MAX_WIDTH_TABLET} />;
const Mobile = props => <Responsive {...props} maxWidth={Constants.MAX_WIDTH_MOBILE} />;
const Default = props => <Responsive {...props} minWidth={Constants.DEFAULT_WIDTH} />;


function changeGaPage(path) {
    ReactGA.pageview(path);
    console.log("changed path to: ", path);
}

const Search = Input.Search;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    changeGaPage(props.location.pathname);
    this.state = {

      notes: null,
      credentials: { runTutorial: null },
      menu: (
        <Menu>
          <Menu.Item>
            <a onClick={() => this.sortNotes('category')}>By Category</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.sortNotes('lastUpdated')}>By Last Updated</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.sortNotes('title')}>By Name (A-Z)</a>
          </Menu.Item>
        </Menu>
      ),
      noteColumns: [{
        title: 'Name',
        dataIndex: 'title',
        render(text, record) {
          return {
            props: {
              style: { background: record.noteColor },
            },
            children: <div>{text}</div>,
          };
        },
      }, {
        title: 'Date Created',
        dataIndex: 'createdAt',
        render(text, record) {
          return {
            props: {
              style: { background: record.noteColor },
            },
            children: <div>{text}</div>,
          };
        },
      }, {
        title: 'Last Updated',
        dataIndex: 'lastUpdated',
        render(text, record) {
          return {
            props: {
              style: { background: record.noteColor },
            },
            children: <div>{text}</div>,
          };
        },
      }, {
        title: 'Category',
        dataIndex: 'category',
        width:"13vw",
        render(text, record) {
          return {
            props: {
              style: { background: record.noteColor },
            },
            children: <div>{text}</div>,
          };
        },
      }, {
        title: 'Act',
        className: "classNameOfColumn",
        width:"13vw",
          render: (text, record) => {
              return (
              <div>
                  <a className={'editNote'} onClick={() => this.goToNote(record._id)}>Edi</a>
                  <br />
                  <Popconfirm
                      title="Are you sure you want to delete this note?"
                      icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                      style={{ color: 'red' }}
                      onConfirm={() => this.deleteNote(record._id)}
                      okText="Yes"
                      cancelText="No">
                      <a className={'deleteNote'}>Del</a>
                  </Popconfirm>
              </div>
          );
          },
      }],
    };
  }

  componentDidMount() {
      if (!localStorage.getItem('id')){
          return this.props.history.push('/login')
      }
    const id = localStorage.getItem('id');
    const refreshToken = localStorage.getItem('refresh_token');
    let AuthStr = 'Bearer '.concat(refreshToken);
    axios.get(`${backendURL}/refresh`, { headers: { Authorization: AuthStr } }).then((response) => {
        console.log("NEW ACCESS TOKEN");
      localStorage.setItem('access_token', response.data.access_token);
        console.log(localStorage.getItem('access_token'));
    }).catch((error) => {
      console.log(error, 'ERROR - BAD REFRESH TOKEN');
    });
    const access_token_new = localStorage.getItem('access_token');
    AuthStr = 'Bearer '.concat(access_token_new);
    axios.get(`${backendURL}/get-data`, { headers: { Authorization: AuthStr }, params: { id } }).then((response) => {
      this.setState({
        notes: response.data.notes,
        credentials: response.data.credentials,
      });
    }).catch((error) => {
      console.log(error, 'ERROR - INVALID or NO COOKIES');
    });
  }



  createNote(email) {
    const accessToken = localStorage.getItem('access_token');
    const AuthStr = 'Bearer '.concat(accessToken);
    const headers = { Authorization: AuthStr };

    console.log(headers);
    axios.get(`${backendURL}/new-note`, {headers:headers}).then((response) => {
        const parsedData = response.data;
        this.goToNote(parsedData._id);
    });

  }

  logout() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const AuthStr = 'Bearer '.concat(accessToken);
    const AuthStr2 = 'Bearer '.concat(refreshToken);
    const headers = { Authorization: AuthStr };
    axios.get(`${backendURL}/logout`, { headers });
    axios.get(`${backendURL}/logout2`, { headers: { Authorization: AuthStr2 } }).then((response) => {
      localStorage.clear();
      this.props.history.push('/login');
    });
  }

  switchView(child) {
    // console.log(this.state.notes);
    if (child) {
      this.setState({ isTableView: true });
    } else {
      this.setState({ isTableView: false });
    }
  }

  sortNotes(option) {
    const sortedNotes = mergeSort(this.state.notes, option);
    this.setState({ notes: sortedNotes });
  }

  searchNotes(query){
      const accessToken = localStorage.getItem('access_token');
      const AuthStr = 'Bearer '.concat(accessToken);
      const headers = { Authorization: AuthStr };

      axios.get(`${backendURL}/get-notes`, {headers:headers}).then((response) => {
          var parsedData = response.data;
                  if (query.trim().length !== 0){
            const filteredNotes = [];
            for (let note in parsedData.notes){
                if (parsedData.notes[note].title.toLowerCase().includes(query.toLowerCase()) ||
                    parsedData.notes[note].category.toLowerCase().includes(query.toLowerCase())){
                    filteredNotes.push(parsedData.notes[note])
                }
            }
            this.setState({'notes': filteredNotes})
        } else {
            this.setState({'notes': parsedData.notes})
        }
      });
  }
    /*
     * Reomved the email parameter because it was not ever used
     * Spring 2019
     */
    deleteNote(noteID) {
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

    /*
    * refresh the front end when we deleted some notes, should be passed to the child component CardNote
    * Spring 2019
    */
    handleDelete(note) {
      this.deleteNote(note._id);
      const newNotes = this.state.notes.filter(n => n != note);
      this.setState({notes:newNotes})
    }

    goToNote(noteID) {
        this.props.history.push({
            pathname: `/note/${noteID}`,
            state: { noteID },
        });
    }

  render() {
    document.body.style.backgroundColor = "#eaeaea";
    const menuHelper = (
        <Menu>
            <Menu.Item key="0">
              <Dropdown overlay={this.state.menu}>
                 <Icon type="filter" theme="filled" style={{'color': '#466fb5', 'margin-right': '20px'}}/>
              </Dropdown>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1">
                <Switch checkedChildren="table" unCheckedChildren="card" onChange={child => this.switchView(child)} style={{'margin-right': '20px'}} />
            </Menu.Item>
            <Menu.Item key="2">
                <Icon type="setting" theme="filled" onClick={() => this.props.history.push('/default-settings')} style={{'margin-right': '20px'}}/>
            </Menu.Item>
            <Menu.Item key="3">
                <Button type="primary" className="generateNewNote" onClick={() => this.createNote(localStorage.getItem('email'))} style={{'margin-right': '20px'}}>New Document</Button>
            </Menu.Item>
          </Menu> 
    )
    const menu = (
      <div className={"middle"}>
        <div className={"child"}>
          <Desktop>
            <Search
              onChange={searchContent => this.searchNotes(searchContent.target.value)}
              className = {"formatted"}
              style={{ width: 200, marginRight: 20 }}
            />
            <Dropdown overlay={this.state.menu}>
               <Icon type="filter" theme="filled" style={{'color': '#466fb5', 'margin-right': '20px'}}/>
            </Dropdown>
            <Switch checkedChildren="table" unCheckedChildren="card" onChange={child => this.switchView(child)} style={{'margin-right': '20px'}} />
            <Icon type="setting" theme="filled" onClick={() => this.props.history.push('/default-settings')} style={{'margin-right': '20px'}}/>
            <Button type="primary" className="generateNewNote" onClick={() => this.createNote(localStorage.getItem('email'))} style={{'margin-right': '20px'}}>New Document</Button>
          </Desktop>
          <Tablet>
            <Search
              onChange={searchContent => this.searchNotes(searchContent.target.value)}
              className = {"formatted"}
              style={{ width: 200, marginRight: 20 }}
            />
            <Dropdown overlay={this.state.menu}>
               <Icon type="filter" theme="filled" style={{'color': '#466fb5', 'margin-right': '20px'}}/>
            </Dropdown>
            <Switch checkedChildren="table" unCheckedChildren="card" onChange={child => this.switchView(child)} style={{'margin-right': '20px'}} />
            <Icon type="setting" theme="filled" onClick={() => this.props.history.push('/default-settings')} style={{'margin-right': '20px'}}/>
            <Button type="primary" className="generateNewNote" onClick={() => this.createNote(localStorage.getItem('email'))} style={{'margin-right': '20px'}}>New Document</Button>   
          </Tablet>
          <Mobile>
            <Dropdown overlay={menuHelper} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">
                <Icon type="down-square" style = {{fontSize : '32px'}} />
              </a>
            </Dropdown>
            <Search
                onChange={searchContent => this.searchNotes(searchContent.target.value)}
                className = {"formatted"}
                style={{ width: 200, marginRight: 20 }}
              />
          </Mobile>
        </div>
      </div>
      // <Walkthrough runTutorial={this.state.credentials.runTutorial} />
    );
    if (!this.state.isTableView) {
      return (
      <div style={{background: "#eaeaea"}}>
            <NavigationBar/>
            {menu}
                <div className={"child"}>
            <div className={"bottom"}>
              <CardNote handleDelete = {note => this.handleDelete(note)} goToNote = {noteID => this.goToNote(noteID)} notes={this.state.notes} history={this.props.history}/>
            </div>
        </div>
      )
    }
    return (
      <div style={{background: "#eaeaea"}}>
        <NavigationBar/>
        {menu}
        <div className={"bottom"}>
            <Table
                dataSource={this.state.notes}
                className="notesTable"
                rowKey="_id"
                columns={this.state.noteColumns}
                pagination={{defaultPageSize: 10}}
                rowClassName={(record) => record.noteColor}
                size = "small"
            />
        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
