import React from 'react';
import { Table, Button, Switch, Input, Menu, Dropdown, Icon, Popconfirm } from 'antd';
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

const Search = Input.Search;
function NavBarHelper(props) {
    if (props.compact) {
        return (
            <div className={"middle"}>
                <div className={"child"}>
                    <Walkthrough runTutorial={this.state.credentials.runTutorial} />
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
                </div>
            </div>
        )
    }
}
export default NavBarHelper