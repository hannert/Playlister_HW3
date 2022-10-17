import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalStoreContext } from '../store';


function DeleteSongModal(props) {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();


    function handleConfirm(event) {
        event.stopPropagation();
        console.log(store.deleteSongIndex, 
            store.songMarkedForDeletion, 
            store.currentSongLength)
        store.addDeleteSongTransaction(
            store.deleteSongIndex, 
            store.songMarkedForDeletion, 
            store.currentSongLength
        );
    }
    function handleCancel(event) {
        event.stopPropagation();

        store.hideDeleteSongModal();
    }

    let modalClass = "modal"
    if(store.isDeleteSongModalActive()){
        modalClass += " is-visible"
    }
    let songToDelete = "[REDACTED]"
    if(store.songMarkedForDeletion){
        songToDelete = store.songMarkedForDeletion.title
    }
    return (
        <div 
            className={modalClass} 
            id="delete-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-delete-list-root'>
                    <div className="modal-north">
                        Delete song?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently remove {songToDelete} from the playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            className="modal-button" 
                            onClick={handleConfirm}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            className="modal-button" 
                            onClick={handleCancel}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteSongModal;