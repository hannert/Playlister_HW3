import jsTPS_Transaction from "../common/jsTPS.js"

export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, initOldSongIndex, initNewSongIndex) {
        super();
        this.app = initApp;
        this.oldSongIndex = initOldSongIndex;
        this.newSongIndex = initNewSongIndex;
    }

    doTransaction() {
        this.app.moveSong(this.oldSongIndex, this.newSongIndex);
    }
    
    undoTransaction() {
        this.app.moveSong(this.newSongIndex, this.oldSongIndex);
    }
}