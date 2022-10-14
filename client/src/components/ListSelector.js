import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
import DeleteListModal from './DeleteListModal'
import ListCard from './ListCard.js'
/*
    This React component lists all the playlists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []); // Adding an empty array in the second argument only does this after the initial render 

    function handleCreateNewList() {
        store.createNewList();
        console.log(store.getCurrentCount());
    }
    let listCard = "";
    if (store) {
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
            />
        ))
    }
    return (
        <div id="playlist-selector">
            <DeleteListModal />
            <div id="list-selector-list">
            <div id="playlist-selector-heading">
                <input
                    type="button"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                    className="playlister-button"
                    value="+" />
                <div>
                    Your Lists
                </div>
            </div>                {
                    listCard
                }
            </div>
        </div>)
}

export default ListSelector;