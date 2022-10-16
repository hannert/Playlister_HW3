import { createContext, useEffect, useState } from 'react';
import api from '../api';
import jsTPS from '../common/jsTPS';
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
        recentlyAddedListId: '',
        recentlyAddedSongId: '',
        newListCounter: 0,
        listNameActive: false,
        deleteListModalActive: false,
        listMarkedForDeletion: null,
        editSongModalActive: false,
        editSongIndex: null,
        editSongId: null,
        deleteSongIndex: null,
        songMarkedForDeletion: null,
        deleteSongModalActive: false,
    });

    useEffect(() => {
        if (!store.deleteListModalActive) {
            console.log("Awesome")
            store.hideDeleteListModal();
            store.loadIdNamePairs();
        }
        console.log("Delete list changed----------------------------------")
    }, [store.deleteListModalActive])

    // useEffect(() => {   
    //     console.log("--------- UseEffect triggers ---------")
    //     store.loadIdNamePairs();
    // }, [store.recentlyAddedListId])

    useEffect(() => {
        console.log("Useeffect, edit song modal off")
        if (!store.editSongModalActive && store.currentList?._id) {
            store.hideEditSongModal();
            store.setCurrentList(store.currentList?._id);
        }
    }, [store.editSongModalActive])

    useEffect(() => {
        console.log("Useeffect, delete song modal off")
        if (!store.deleteSongModalActive && store.currentList?._id) {
            store.hideDeleteSongModal();
            store.setCurrentList(store.currentList?._id);
        }
    }, [store.deleteSongModalActive])


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
                    currentList: payload.playlist,
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
                    recentlyAddedListId: payload._id,
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
                    currentList: payload,
                    listNameActive: false
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
                store.refreshCurrentPlaylist();
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
                    editSongIndex: null
                })
            }
            case GlobalStoreActionType.EDIT_MARKED_SONG: {
                console.log("Editing song in reducer")
                return setStore({
                    ...store,
                    editSongModalActive: false,
                    editSongIndex: null
                })
            }

            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                console.log("Marking song for deletion", payload)
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
            store.loadIdNamePairs();
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist
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
            console.log("What the fuck")
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
        
        asyncDeleteMarkedList(id).then(console.log("Aweomse"));
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
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
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
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
    store.updateMarkedSong = function (payload) {
        async function asyncUpdateMarkedSong(id, payload) {
            console.log(payload, store.currentList._id)
            let response = await api.getPlaylistById(id);
            // store.hideEditSongModal(); // Hide modal once we hit confirm
            if (response.data.success) {
                console.log("successfully found playlist", response.data.dbug)
                let playlist = response.data.playlist;
                playlist.songs[store.editSongIndex] = payload;
                async function updateList(playlist) {
                    console.log(playlist)
                    response = await api.updatePlaylistById(id, playlist);
                    store.refreshCurrentPlaylist();
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.UPDATE_SONG,
                            payload: {}
                        });
                    }
                }
                updateList(playlist);
            }

        }
        asyncUpdateMarkedSong(store.currentList?._id, payload)
    }

    store.markSongForDeletion = function(index, song){
        // Should enable the delete list modal
        console.log("marking for SONG deletion in store", index)
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


    store.deleteMarkedSong = function (index) {
        async function asyncDeleteMarkedSong(id, index) {
            let response = await api.getPlaylistById(id, index)
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs.splice(index, 1);
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(id, playlist);
                    store.refreshCurrentPlaylist();
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
        asyncDeleteMarkedSong(store.currentList?._id, store.deleteSongIndex)
    }

    store.refreshCurrentPlaylist = function () {
        console.log("Refreshing current playlist...")
        async function asyncRefreshCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }        
        }
        asyncRefreshCurrentList(store.currentList?._id);
    }

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
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
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