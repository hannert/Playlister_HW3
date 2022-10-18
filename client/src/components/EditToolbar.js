import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalStoreContext } from '../store';
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }

    function handleAddSong() {
        console.log("EditToolbar clicked", store.currentList?.songs.length)
        store.addAddSongTransaction(store.currentList?.songs.length);
    }


    let addSongButtonClass = "playlister-button";
    let undoSongButtonClass = "playlister-button";
    let redoSongButtonClass = "playlister-button";
    let closeListButtonClass = "playlister-button";

    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    if(!store.currentList) {
        addSongButtonClass+= "-disabled";
        undoSongButtonClass+= "-disabled";
        redoSongButtonClass+= "-disabled";
        closeListButtonClass+= "-disabled";
        enabledButtonClass += "-disabled";
        editStatus = true;
    } else {
        if(store.hasActionsToRedo() === false) redoSongButtonClass += "-disabled";
        if(store.hasActionsToUndo() === false) undoSongButtonClass += "-disabled";
                
    }

    if(store.isSongModalActive() === true) {
        addSongButtonClass = "playlister-button-disabled";
        undoSongButtonClass = "playlister-button-disabled";
        redoSongButtonClass = "playlister-button-disabled";
        closeListButtonClass = "playlister-button-disabled";
    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus}
                value="+"
                className={addSongButtonClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={editStatus}
                value="⟲"
                className={undoSongButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={editStatus}
                value="⟳"
                className={redoSongButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={editStatus}
                value="&#x2715;"
                className={closeListButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;