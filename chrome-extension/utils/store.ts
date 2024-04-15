import { generateKeyPair, generateUUID } from "./utils";

import { Storage } from "@plasmohq/storage";
 
const storage = new Storage()


let listeners = [];
let state = {}
export const store = {
    page: 'signin',
    user: null,
    selection: [],
    selectedSite: null,
    designSystem: null,
    exportedComponent: null,

    async logout() {
        this.user = null
        this.clearData()
        await this.initalizeUser()
        this.page = 'signin'
        emitChange();
    },
    clearData: async () => {
        // await setClientStorage('user', null)
        this.user = null
        // await setData('todos', null)
        // await setData('triggers', null)
    },
    async authenticateUser(userData:object) {
        this.user = {
            ...this.user,
            ...userData,
            authenticated: true,
        }
        this.selectedSite = this.user.sites?.[0]
        // await setClientStorage('user', this.user)
        emitChange();
    },
    setSelectedSite(site) {
        this.selectedSite = site
        emitChange();
    },
    async initalizeUser() {
        let user = await storage.get('user')
        console.log('user', user);
        
        if (!user) {
          user = await storage.set('user', {
              anonymousId: generateUUID(),
              authenticated: false,
          })
            this.user = user
        } else {
            this.user = user
            this.setPage('home')
        }
        emitChange();
    },
    setKeySecret() {
        const { key, secret } = generateKeyPair()
        this.user = {
            ...this.user,
            key,
            secret,
        }
        return {key,secret}
    },
    subscribe(listener) {
        listeners = [...listeners, listener];
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
    getSnapshot() {
        return this
    },
    setPage(page) {
        this.page = page
        emitChange();
    },
    setSelection(selection) {
        this.selection = selection
        
        emitChange();
    },
    async fetchDesignSystem(){
        // if(this.designSystem) return this.designSystem
        // const dsStart = Date.now()
        // const ds = await getDesignSystem()
        // this.designSystem = ds
        // const dsEnd = Date.now()
        // return ds
    },
    setExportedComponent(component) {
        this.exportedComponent = component
        
        emitChange();
    }
    // Update function with a callback
    // update(updater) {

    //     emitChange();
    // }
};

function emitChange() {
    for (let listener of listeners) {
        listener();
    }
}

export interface IStore {
    page: 'signin'
    user?: {
        id: string
    }
    addTodo: () => void;
    subscribe: (listener: () => void) => () => void;
    getSnapshot: () => any;
}