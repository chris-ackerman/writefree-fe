import React from 'react';
import CardList from './CardList';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import '../../css/cardnote.css';

const CardNote = props => (
	// pass the handleDelete to refesh the state of Dashborad when we delete a note
    <CardList handleDelete = {props.handleDelete} notes={props.notes} history={props.history}/>
);

export default withRouter(CardNote);
