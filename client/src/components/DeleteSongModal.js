import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalStoreContext } from '../store';


function DeleteSongModal(props) {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();


    function handleConfirm(event) {
        event.stopPropagation();
        store.deleteMarkedSong(store.songMarkedForDeletion._id);
    }
    function handleCancel(event) {
        event.stopPropagation();
        store.hideDeleteSongModal();
    }

    let modalClass = "modal"
    if(store.isDeleteSongModalActive()){
        modalClass += " is-visible"
    }
    let songToDelete = "Something went wrong.."
    // if(store.songMarkedForDeletion !== null){
    //     songToDelete = store.currentList?.songs[store.songMarkedForDeletion].title
    // }
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
                            Are you sure you wish to permanently delete the {songToDelete} playlist?
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