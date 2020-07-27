/**
 * Copyright (c) 2020 Alexzander Purwoko Widiantoro
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 /**
  * This module is an abstract class to provide
  * some function (that will be inherited by subclass)
  * to manage the Database (IndexedDB)
  */

import {deleteDB} from 'idb';
import DBCallbacks from './DBCallbacks';

class DatabaseHelper {
    constructor() {
        this._db = null;
        this._listCb = [];
    }

    init(){
        this._db = this.onOpenDb();
    }

    addCallbacks(cb){
        if(!cb) return;
        if(!cb instanceof DBCallbacks)return;
        if(this._listCb.findIndex(a=>a===cb) >= 0) return;
        this._listCb.push(cb);
    }

    removeCallbacks(cb) {
        if(!cb) return;
        if(!cb instanceof DBCallbacks)return;
        if(this._listCb.findIndex(a=>a===cb) < 0) return;
        this._listCb = this._listCb.filter(a => a!==cb);
    }

    _notifyAllCallbacks(){
        this._listCb.forEach(a => {
            a.onDataChanged(this);
        })
    }

    async deleteThisDb() {
        try {
            await deleteDB(this.dbName, {
                blocked() {
                    throw new Error('Database cannot be deleted! Maybe wait until any operation closed!');
                }
            });
            return true;
        } catch(e){
            console.error(e);
            return false;
        }
    }

    get dbName(){
        throw new Error('dbName not implemented!');
    }

    onOpenDb() {
        return null; // must override and return non-null
    }

    // return boolean
    async addData(storeName, data){
        if(!this._db) return false;

        try {
            const db = await this._db;
            const t = db.transaction(storeName, 'readwrite');
            await t.store.add(data);
            this._notifyAllCallbacks();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async addAllData(storeName, arrayOfData){
        if(!this._db) return false;
        if(!arrayOfData) return false;
        if(arrayOfData.length < 1) return false;

        try {
            const db = await this._db;
            const t = db.transaction(storeName, 'readwrite');
            const allPromisses = arrayOfData.map(a => t.store.add(a));
            await Promise.all(allPromisses);
            this._notifyAllCallbacks();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // update data
    // return boolean which indicates success or not
    async setData(storeName, keyData, newValue){
        if(!this._db) return false;

        try {
            const db = await this._db;
            const t = db.transaction(storeName, 'readwrite');
            let isAny = false;
            try {
                const a = await t.store.get(keyData);
                isAny = !(a === undefined || a === null);
            } catch(e){
                isAny = false;
            }
            if(isAny){
                await t.store.delete(keyData);
            } 
            await t.store.add(newValue);
            this._notifyAllCallbacks();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // delete the data
    // returns the boolean
    async deleteData(storeName, keyData){
        if(!this._db) return false;

        try {
            const db = await this._db;
            const t = db.transaction(storeName, 'readwrite');
            await t.store.delete(keyData);
            this._notifyAllCallbacks();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // get the data by KEY (primaryKEY)
    async getByKey(storeName, keyData){
        if(!this._db) return false;

        try {
            const db = await this._db;
            const t = db.transaction(storeName, 'readwrite');
            const result = await t.store.get(keyData);
            return (result === undefined || result === null) ? null : result;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    // get All Data
    // return arrays
    async getAllData(storeName){
        if(!this._db) return false;

        try {
            const db = await this._db;
            const t = db.transaction(storeName, 'readwrite');
            const result = await t.store.getAll();
            return result;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    // return boolean
    async anyData(storeName, keyData){
        const q = await this.getByKey(storeName, keyData);
        return  q ? true:false;
    }

}

export default DatabaseHelper;
