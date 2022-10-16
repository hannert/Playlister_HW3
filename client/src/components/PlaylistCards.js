import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalStoreContext } from '../store';
import DeleteSongModal from './DeleteSongModal';
import EditSongModal from './EditSongModal.js';
import SongCard from './SongCard.js';

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    return (
        <div id="playlist-cards">
            <EditSongModal />
            <DeleteSongModal />
        {
            store.currentList?.songs.map((song, index) => (
                <SongCard
                    id={'playlist-song-' + (index)}
                    key={'playlist-song-' + (index)}
                    index={index}
                    song={song}
                />
            ))
        }
        </div>
    )
}

export default PlaylistCards;