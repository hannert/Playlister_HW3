import jsTPS_Transaction from "../common/jsTPS.js";

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, initIndex,initOld,initNew ) {
        super();
        this.app = initApp;
        this.index = initIndex;
        this.oldInfo = initOld;
        this.newInfo = initNew;
    }

    doTransaction() {
        // Edit song
        this.app.updateMarkedSong(this.newInfo, this.index)
    }
    
    undoTransaction() {
        this.app.updateMarkedSong(this.oldInfo, this.index);
    }
}