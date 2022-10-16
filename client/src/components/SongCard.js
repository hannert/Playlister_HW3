import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;


    function handleToggleEdit(event) {
        event.stopPropagation();

        console.log("Trying to open edit modal...at index", index)
        store.markSongForEdit(index)

    }

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleToggleEdit}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;