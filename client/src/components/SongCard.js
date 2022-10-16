import React, { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const [info, setInfo] = useState({
        isDragging: false,
        draggedTo: false
    })

    const { song, index } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", event.target.id);
        console.log("HEY")
        setInfo({
            ...info,
            isDragging: true
        })
    }
    function handleDragOver(event) {
        event.preventDefault();
        setInfo({
            ...info,
            draggedTo: true
        })
    }
    function handleDragEnter(event) {
        event.preventDefault();
        setInfo({
            ...info,
            draggedTo: true
        })
    }
    function handleDragLeave(event) {
        event.preventDefault();
        setInfo({
            ...info,
            draggedTo: false
        })
    }
    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        if(targetId){
            console.log("WHAT")
            targetId = Number(targetId.charAt(target.id.indexOf("-") + 1)) + 1;
            let sourceId = event.dataTransfer.getData("song");
            sourceId = Number(sourceId.charAt(sourceId.indexOf("-") + 1)) + 1;
            console.log(targetId, sourceId)
            setInfo({
                isDragging: false,
                draggedTo: false
            })

            store.moveSong(sourceId, targetId);

        }
        else {

            setInfo({
                isDragging: false,
                draggedTo: false
            })
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();

        console.log("Trying to open edit modal...at index", index)
        store.markSongForEdit(index, song.title)

    }

    function handleDelete(event) {
        event.stopPropagation();

        console.log("Handle delete")
        store.markSongForDeletion(index, song)
    }

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleToggleEdit}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable={true}
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
                onClick={handleDelete}
            />
        </div>
    );
}

export default SongCard;