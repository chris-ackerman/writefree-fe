import CardListItem from "./CardListItem";
import React from "react";
import '../../css/cardnote.css';

const CardList = (props) => {
    try{
        const cardItems = props.notes.map(note => (
            // pass the handleDelete to refesh the state of Dashborad when we delete a note
             <CardListItem goToNote = {props.goToNote} handleDelete = {props.handleDelete} key={note._id} note={note} history={props.history}/>
        ));
        return (
            <div className="cards">
                {cardItems}
            </div>
        );
    } catch (e){
        return <div></div>
    }

};

export default CardList;
