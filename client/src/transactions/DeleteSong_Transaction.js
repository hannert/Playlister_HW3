import jsTPS_Transaction from "../common/jsTPS.js";

export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, initIndex, initPayload, initLength) {
        super();
        this.app = initApp;
        this.songNum = initIndex;
        this.song = initPayload;
        this.listLength = initLength;
    }

    doTransaction() {
        this.app.deleteMarkedSong(this.songNum);
    }
    
    undoTransaction() {
        this.app.addSongToPlaylistAtIndex(this.songNum, this.song)
    }
}