import { createContext, useEffect, useState } from 'react';
import api from '../api';
import jsTPS from '../common/jsTPS';
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction.js';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    HIDE_DELETE_LIST_MODAL: "HIDE_DELETE_LIST_MODAL",
    DELETE_MARKED_LIST: "DELETE_MARKED_LIST",
    ADD_SONG: "ADD_SONG",
    UPDATE_SONG_BY_ID: "UPDATE_SONG_BY_ID",
    REMOVE_SONG_BY_ID: "REMOVE_SONG_BY_ID",
    MARK_SONG_FOR_EDIT: "MARK_SONG_FOR_EDIT",
    HIDE_EDIT_SONG_MODAL: "HIDE_EDIT_SONG_MODAL",
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION",
    HIDE_DELETE_SONG_MODAL: "HIDE_DELETE_SONG_MODAL",
    DELETE_MARKED_SONG: "DELETE_MARKED_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        currentSongLength: 0,
        recentlyAddedListId: '',
        recentlyAddedSongId: '',
        newListCounter: 0,
        listNameActive: false,
        deleteListModalActive: false,
        listMarkedForDeletion: null,
        editSongModalActive: false,
        editSongIndex: null,
        editSongId: null,
        successfulEdit: false,
        deleteSongIndex: null,
        songMarkedForDeletion: null,
        deleteSongModalActive: false,
    });

    useEffect(() => {
        store.loadIdNamePairs();
    }, [store.recentlyAddedListId])





    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                console.log("Changing list name")
                return setStore({
                    ...store,
                    idNamePairs: payload.idNamePairs,
                    recentlyAddedListId: 'Just emptied dawg',
                    listNameActive: false,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                console.log("Closing list")
                return setStore({
                    ...store,
                    currentList: null,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                console.log("Created a new list.")
                console.log("With new iD of:",payload._id);
                return setStore({
                    ...store,
                    recentlyAddedListId: payload.id,
                    currentList: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: true,
                    newId: 'awesome',
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                console.log('load id name pairs ')
                return setStore({
                    ...store,
                    idNamePairs: payload,
                    currentList: null,
                    deleteListModalActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    ...store,
                    currentList: null,
                    listNameActive: false,
                    deleteListModalActive: true,
                    listMarkedForDeletion: payload
                });
            }
            // USER CANCELED DELETION OF LIST, HIDE THE MODAL
            case GlobalStoreActionType.HIDE_DELETE_LIST_MODAL: {
                return setStore({
                    ...store,
                    deleteListModalActive: false,
                    currentList: null
                })
            }


            case GlobalStoreActionType.DELETE_MARKED_LIST: {
                console.log("Delete")
                return setStore({
                    ...store,
                    currentList: null,
                    listNameActive: false,
                    deleteListModalActive: false
                });
            }          
            

            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                console.log("Set current list")
                return setStore({
                    ...store,
                    currentList: payload.list,
                    currentSongLength: payload.length - 1,
                    listNameActive: false,
                    deleteSongModalActive: false,
                    editSongModalActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                console.log("Starting editing...")

                return setStore({
                    ...store,
                    currentList: payload,
                    listNameActive: true
                });
            }

            // ADDING A SONG
            case GlobalStoreActionType.ADD_SONG: {
                console.log("Addign song...")
                return setStore({
                    ...store,
                    currentList: payload
                });
            }

            // Section for editing a song
            case GlobalStoreActionType.MARK_SONG_FOR_EDIT: {
                console.log("Marking song for edit...")
                return setStore({
                    ...store,
                    editSongModalActive: true,
                    editSongIndex: payload
                })
            }
            case GlobalStoreActionType.HIDE_EDIT_SONG_MODAL: {
                console.log("Hiding edit song modal in reducer")
                return setStore({
                    ...store,
                    editSongModalActive: false,
                    editSongIndex: 'hiding'
                })
            }
            case GlobalStoreActionType.EDIT_MARKED_SONG: {
                console.log("Editing song in reducer", store.successfulEdit)
                return setStore({
                    ...store,
                    editSongModalActive: false,
                    editSongIndex: "whaat",
                    successfulEdit: !store.successfulEdit,
                })
            }

            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                console.log("Marking song for deletion in reducer", payload)
                return setStore({
                    ...store,
                    deleteSongModalActive: true,
                    deleteSongIndex: payload.index,
                    songMarkedForDeletion: payload.song
                })
            }
            case GlobalStoreActionType.HIDE_DELETE_SONG_MODAL: {
                return setStore({
                    ...store,
                    deleteSongModalActive: false,
                    deleteSongIndex: null,
                    songMarkedForDeletion: null
                })
            }
            case GlobalStoreActionType.DELETE_MARKED_SONG: {
                return setStore({
                    ...store,
                    deleteSongModalActive: false,
                    deleteSongIndex: null,
                    songMarkedForDeletion: null
                })
            }


            default:
                return store;
        }
    }
     // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // Adds a empty list
    store.createNewList = function () {
        async function asyncCreateNewPlaylist() {
            const response = await api.createNewPlaylist();
            
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: {'playlist': playlist, 'id':playlist._id}
                })
                console.log("Successfully created a new playlist")
            }
            else {
                console.log("API FAILED TO CREATE NEW PLAYLIST");
            }
        }
        
        asyncCreateNewPlaylist();
    }

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    console.log(playlist)
                    response = await api.updatePlaylistById(id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                    else {
                        console.log("API FAILED TO UPDATE LIST NAME")
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }



    store.markListForDeletion = function(song){
        // Should enable the delete list modal
        console.log("marking for deletion in store")
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: song
        })
    }

    store.hideDeleteListModal = function() {
        console.log("Hiding delete list modal in store ");
        storeReducer({
            type: GlobalStoreActionType.HIDE_DELETE_LIST_MODAL,
            payload: {}
        })
    }


    store.deleteMarkedList = function (id) {
        console.log("Attempting to delete the marked list", id)
        async function asyncDeleteMarkedList(id) {
            const response = await api.deletePlaylistById(id);
            store.loadIdNamePairs();
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.DELETE_MARKED_LIST,
                    payload: {}
                })
            }
            else {
                console.log("API FAILED TO DELETE PLAYLIST");
            }
        }
        
        asyncDeleteMarkedList(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();

        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        console.log("loadIdNamePairs")
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
                console.log("Successfully loaded idnamepairs")
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: {'list': playlist, 'length': playlist.songs.length}
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
                return 1;
            }
        }
        asyncSetCurrentList(id);
    }

    store.addSongToPlaylist = function () {
        console.log("Trying to add song in store...")
        async function asyncAddSongToPlaylist(id) {
            let response = await api.addSongToPlaylist(id);
            store.setCurrentList(id);
            if (response.data.success) {
                console.log("successfully added", response.data.dbug)
                storeReducer({
                    type: GlobalStoreActionType.ADD_SONG,
                    payload: response.data.dbug
                });
            }
            return true;
        }
        console.log(store.currentList._id)
        asyncAddSongToPlaylist(store.currentList._id);
    }

    store.markSongForEdit = function (index) {
        console.log("Markiing song for edit")
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_EDIT,
            payload: index
        });

    }

    store.hideEditSongModal = function() {
        console.log("Hiding edit song modal in store ");
        storeReducer({
            type: GlobalStoreActionType.HIDE_EDIT_SONG_MODAL,
            payload: {}
        })
    }

    store.updateMarkedSong = function (payload, index = null) {
        console.log('markedonsg', payload)
        async function asyncUpdateMarkedSong(id, payload, index) {
            console.log(payload, store.currentList._id)
            let response = await api.getPlaylistById(id, index);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs[index] = payload;
                async function updateList(playlist) {
                    console.log(playlist)
                    response = await api.updatePlaylistById(id, playlist);
                    store.setCurrentList(store.currentList?._id)

                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.EDIT_MARKED_SONG,
                            payload: {}
                        });
                    }
                    return true
                }
                return updateList(playlist);
            }

        }
        if  (index !== null ) {
            return asyncUpdateMarkedSong(store.currentList?._id, payload, index)
        }
        else {
            return asyncUpdateMarkedSong(store.currentList?._id, payload, store.editSongIndex)

        }
    }

    store.markSongForDeletion = function(index, song){
        // Should enable the delete list modal
        console.log("marking for SONG deletion in store at index", index)
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
            payload: {'index': index, 'song': song}
        })
    }

    store.hideDeleteSongModal = function() {
        console.log("Hiding delete song modal in store ");
        storeReducer({
            type: GlobalStoreActionType.HIDE_DELETE_SONG_MODAL,
            payload: {}
        })
    }


    store.deleteMarkedSong = function (index = null) {
        async function asyncDeleteMarkedSong(id, index) {
            console.log("DeleteMakredSong")
            let response = await api.getPlaylistById(id, index)
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs.splice(index, 1);
                console.log(playlist)
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(id, playlist);
                    store.setCurrentList(store.currentList?._id)
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.DELETE_MARKED_SONG,
                            payload: {}
                        });
                    }
                }
                updateList(playlist);
            }

        }
        if (index !== null) {
            asyncDeleteMarkedSong(store.currentList?._id, index)
        } else {
            asyncDeleteMarkedSong(store.currentList?._id, store.deleteSongIndex)
            
        }

        
    }

    store.moveSong = function(start, end) {
        async function asyncMoveSong(start, end, listId) {
            console.log( listId)
            let response = await api.getPlaylistById(listId);
            if (response.data.success) {
                console.log("successfully found playlist")
                let playlist = response.data.playlist;
                let songs = playlist.songs;

                start -= 1;
                end -= 1;

                if (start < end) {
                    let temp = songs[start];
                    for (let i = start; i < end; i++) {
                        songs[i] = songs[i + 1];
                    }
                    songs[end] = temp;
                }
                else if (start > end) {
                    let temp = songs[start];
                    for (let i = start; i > end; i--) {
                        songs[i] = songs[i - 1];
                    }
                    songs[end] = temp;
                }

                console.log("updated songs list", songs)
                async function updateList(playlist) {
                    console.log(playlist)
                    response = await api.updatePlaylistById(listId, playlist);
                    // store.refreshCurrentPlaylist();
                    store.setCurrentList(store.currentList?._id)
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.UPDATE_SONG,
                            payload: {}
                        });
                    }
                    return true
                }
                return updateList(playlist);
            }

        }
        return asyncMoveSong(start, end, store.currentList?._id)
    }

    // store.refreshCurrentPlaylist = function () {
    //     console.log("Refreshing current playlist...")
    //     async function asyncRefreshCurrentList(id) {
    //         let response = await api.getPlaylistById(id);
    //         if (response.data.success) {
    //             let playlist = response.data.playlist;

    //             if (response.data.success) {
    //                 storeReducer({
    //                     type: GlobalStoreActionType.SET_CURRENT_LIST,
    //                     payload: playlist
    //                 });
    //             }
    //         }        
    //     }
    //     asyncRefreshCurrentList(store.currentList?._id);
    // }

    store.addMoveSongTransaction = function(start, end) {
        console.log("Adding Transaction")
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    store.addAddSongTransaction = function(index) {
        let transaction = new AddSong_Transaction(store, index);
        tps.addTransaction(transaction);
    }
    store.addDeleteSongTransaction = function(index, payload, length) {
        console.log(index)
        let transaction = new DeleteSong_Transaction(store, index, payload, length);
        tps.addTransaction(transaction);
    }
    store.addEditSongTransaction = function(index, oldInfo, newInfo) {
        let transaction = new EditSong_Transaction(store, index, oldInfo, newInfo);
        tps.addTransaction(transaction);    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.getRecentlyAddedListId = function () {
        return store.recentlyAddedListId;
    }
    store.getCurrentCount = function () {
        return store.newListCounter;
    }
    store.isDeleteListModalActive = function() {
        return store.deleteListModalActive;
    }
    store.isEditSongModalActive = function() {
        return store.editSongModalActive;
    }
    store.isDeleteSongModalActive = function() {
        return store.deleteSongModalActive;
    }

    store.hasActionsToUndo = function() {
        return tps.hasTransactionToUndo;
    }
    store.hasActionsToRedo = function() {
        return tps.hasTransactionToRedo;
    }

    store.undo = function () {
        if(tps.hasTransactionToUndo())
            tps.undoTransaction();
    }
    store.redo = function () {
        if(tps.hasTransactionToRedo()){
            console.log("redo")
            tps.doTransaction();
        }
            
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}