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
        // let deleteSong = new Promise((resolve, reject) => {
        //     let ans = this.app.deleteMarkedSong(this.songNum);
        //     if (ans) 
        //         resolve(ans)
        //     else 
        //         reject(ans)
        // });
        // deleteSong.then(this.app.refreshCurrentPlaylist()).catch(() => {
        //     console.log("Error in deleting song")
        // })

        this.app.deleteMarkedSong(this.songNum);
    }
    
    undoTransaction() {
        console.log(this.songNum)

        let add = new Promise((resolve, reject) => {
            let ans = this.app.addSongToPlaylist();
            if (ans) 
                resolve(ans)
            else 
                reject(ans)
        })
        let move = new Promise((resolve, reject) => {
            console.log("moving")
            let ans = this.app.moveSong(this.listLength, this.songNum);
            if (ans)
                resolve(ans)
            else
                reject(ans)

        })
        let update = new Promise((resolve, reject) => {
            console.log('updating')
            let ans = this.app.updateMarkedSong(this.song, this.songNum);
            if (ans) 
                resolve(ans)
            else
                reject(ans)

        })
        add.then(move).then(update).catch( () =>{
                console.log("Error?")
            }   
        )
    }
}