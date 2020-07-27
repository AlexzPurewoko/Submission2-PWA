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
  * An implementation of DatabaseHelper class.
  */

import DatabaseHelper from './DatabaseHelper';
import {openDB} from 'idb';

class MainFootballDB extends DatabaseHelper {
    constructor() {
        super();
        this.d = openDB(this.dbName, 1, {
            upgrade(db) {
                db.createObjectStore(MainFootballDB.MATCH_FAVORITE_STORE, {
                    keyPath: 'id'
                });

                db.createObjectStore(MainFootballDB.TEAM_FAVORITE_STORE, {
                    keyPath: 'id'
                });
                
                db.createObjectStore(MainFootballDB.CURRENT_STATE_FG_STORE, {
                    keyPath: 'id'
                });
            }
        });
        this.init();
    }
    get dbName() {
        return 'main_football_db';
    }

    onOpenDb() {
        return this.d;
    }

    static get MATCH_FAVORITE_STORE() {
        return 'match_teams_favorite';
    }

    static get TEAM_FAVORITE_STORE() {
        return 'team_teams_favorite';
    }

    static get CURRENT_STATE_FG_STORE() {
        return 'current_state_store';
    }
}

export default MainFootballDB;