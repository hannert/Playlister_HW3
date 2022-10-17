import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalStoreContext } from '../store';
/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ editActive, setEditActive ] = useState(false);
    const [ text, setText ] = useState(props.idNamePair.name);
    store.history = useHistory();

    useEffect(() => {
        console.log("Initial render of", props.idNamePair._id, store.recentlyAddedListId)
        if (store.recentlyAddedListId === props.idNamePair._id){
            console.log("Current list is the one just created.");
            toggleEdit();
        } else {
            if( editActive ){
                setEditActive(!editActive)
            }
        }

        
    }, [store.recentlyAddedListId]);

    const { idNamePair, selected } = props;

    function handleLoadList(event) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(_id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleDelete(event) {
        event.stopPropagation();
        console.log("Tyring to delete in listCard");
        store.markListForDeletion(idNamePair);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            console.log(text)
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();   
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value );
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }



    let cardElement =
        <div
            id={idNamePair._id}
            key={idNamePair._id}
            onClick={handleLoadList}
            className={'list-card ' + selectClass}>
            <span
                id={"list-card-text-" + idNamePair._id}
                key={"span-" + idNamePair._id}
                className="list-card-text">
                {idNamePair.name}
            </span>
            <input
                disabled={cardStatus}
                type="button"
                id={"delete-list-" + idNamePair._id}
                className="list-card-button"
                onClick={handleDelete}
                value={"\u2715"}
            />
            <input
                disabled={cardStatus}
                type="button"
                id={"edit-list-" + idNamePair._id}
                className="list-card-button"
                onClick={handleToggleEdit}
                value={"\u270E"}
            />
        </div>;

    if (editActive) {
        cardElement =
            <input
                id={"list-" + idNamePair._id}
                className='list-card'
                type='text'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
            />;
    }
    return (
        cardElement
    );
}

export default ListCard;