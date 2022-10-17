import React, { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../store';

function EditSongModal(){
    const { store } = useContext(GlobalStoreContext);

    const [initDetails, setInitDetails] = useState({
        'title': "",
        'artist': "",
        'youTubeId': ""
    })

    const [title, setTitle] = useState("Initial Title")
    const [artist, setArtist] = useState("Initial Artist")
    const [youTubeId, setYouTubeId] = useState("Initial ID")

    useEffect(() => {
        if(store.currentList && store.editSongModalActive){
            setTitle(store.currentList.songs[store.editSongIndex].title);
            setArtist(store.currentList.songs[store.editSongIndex].artist);
            setYouTubeId(store.currentList.songs[store.editSongIndex].youTubeId);
            setInitDetails({
                'title': store.currentList.songs[store.editSongIndex].title,
                'artist': store.currentList.songs[store.editSongIndex].artist,
                'youTubeId': store.currentList.songs[store.editSongIndex].youTubeId
            });
        }
    }, [store.editSongModalActive])



    function handleConfirm(event){
        event.preventDefault();
        // store.updateMarkedSong({title, artist, youTubeId});
        console.log(store.editSongIndex, initDetails, {title, artist, youTubeId})
        store.addEditSongTransaction(store.editSongIndex, initDetails, {title, artist, youTubeId})
    }

    function handleCancel(event) {
        event.stopPropagation();
        store.hideEditSongModal();
    }
    
    let modalClass = "modal"
    // let modalClass = "modal is-visible"
    if(store.isEditSongModalActive()){
        modalClass += " is-visible"
    }

    return (
        <div 
            className={modalClass}
            id="edit-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-edit-song-root'>
                    <div className="modal-north">
                        Edit Song
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            <div className="modal-edit-grid">
                                <div className="modal-edit-box-text">Title:</div>
                                    <input 
                                        type="text" 
                                        id="edit-song-title-field" 
                                        className="modal-text-submission" 
                                        value={title || ''}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                <div className="modal-edit-box-text">Artist:</div>
                                    <input 
                                        type="text" 
                                        id="edit-song-artist-field" 
                                        className="modal-text-submission" 
                                        value={artist || ''}
                                        onChange={e => setArtist(e.target.value)}
                                    />
                                <div className="modal-edit-box-text">You Tube Id:</div>
                                    <input 
                                        type="text" 
                                        id="edit-song-id-field" 
                                        className="modal-text-submission" 
                                        value={youTubeId || ''}
                                        onChange={e => setYouTubeId(e.target.value)}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="edit-song-confirm-button" 
                            className="modal-button" 
                            value='Confirm' 
                            onClick={handleConfirm} />
                        <input type="button" 
                            id="edit-song-cancel-button" 
                            className="modal-button" 
                            value='Cancel' 
                            onClick={handleCancel} />
                            
                    </div>
                </div>
        </div>
    );
}

export default EditSongModal;