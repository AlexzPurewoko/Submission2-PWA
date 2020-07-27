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
  * This module is intended to serve a response data
  * to get the next match before visualized by view's code 
  */

import {apis, fetchUrl} from '../base/api_methods';
import ModelClass from '../base/ModelClass';

class NextMatch extends ModelClass {
    constructor() {
        super();
        this._season = 2020;
        this._leagueId = 2001;
        this._savedData = {
            type: null,
            count: 0,
            pageCount: 0,
            currentPage: 0,
            currentItemInPage: 0,
            actuallyItemPerPage: 6,
            _offset: [0, 0],
            raw: null
        }
    }

    set season (newSeason){
        this._season = newSeason;
    }

    set leagueId(newId){
        this._leagueId = newId;
    }

    get apiMethod() {
        return apis.next_match(this._leagueId, this._season);
    }

    async startLoadPage(page = 1){
        if(page < 1 || page > this._savedData.pageCount) return;
        const offsetStart = this._savedData.actuallyItemPerPage * (page - 1) + 1;
        let offsetEnd = offsetStart + (this._savedData.actuallyItemPerPage - 1);
        offsetEnd = offsetEnd > this._savedData.count ? this._savedData.count : offsetEnd;
        this._savedData.currentPage = page;
        this._savedData.currentItemInPage = offsetEnd - offsetStart + 1;
        this._savedData._offset = [offsetStart, offsetEnd];
        this._callbacks.onLoad();
        try {
            const response = await this._servedData(); 
            this._callbacks.onFinished(this._composeData(
                ModelClass.STATUS_SUCCESS,
                "Success When retrieving data from APIS",
                {
                    type: 'LOAD_PAGE',
                    res: response
                }
            ));
        } catch(error){
            this._callbacks.onFinished(this._composeData(
                ModelClass.STATUS_FAILED,
                "Error when retrieving data",
                error
            ));
        }
    }

    async _serveData(jsonData) {
        const countData = jsonData.matches.length;
        const a = countData % this._savedData.actuallyItemPerPage;
        const b = Math.floor(countData/this._savedData.actuallyItemPerPage) + (a > 0);
        this._savedData = {
            type: 'LOAD_FIRST',
            count: countData,
            pageCount: b,
            currentPage: 1,
            currentItemInPage: 6,
            actuallyItemPerPage: 6,
            _offset: [1, 6],
            raw: jsonData.matches
        }
        return this._savedData;
    }

    /**
     * return ->
     * [
     *  {
     *      stage: <string>,
     *      utcDate: date,
            homeTeam: {
                id: <integer>,
                name: <string>,
                emblem: <string path>
            },
            awayTeam: {
                id: <integer>,
                name: <string>,
                emblem: <string path>
            },
            lastUpdated: match.lastUpdated
     * }
     * ]
     */

    async _servedData() {

        const result = [];

        const requestTeamID = [];

        //return true if match, otherwise false
        const isExistsTeamID = (idTeam) => {
            return requestTeamID.find(value => value === idTeam) === idTeam; 
        }

        for(let x = this._savedData._offset[0] - 1; x < this._savedData._offset[1]; x++){
            const match = this._savedData.raw[x];
            const stg = match.stage;
            const date = match.utcDate;
            const home = {
                id: match.homeTeam.id,
                name: match.homeTeam.name,
                emblem: null
            };

            const away = {
                id: match.awayTeam.id,
                name: match.awayTeam.name,
                emblem: null
            }

            if(!isExistsTeamID(match.awayTeam.id))
                requestTeamID.push(match.awayTeam.id);
            if(!isExistsTeamID(match.homeTeam.id))
                requestTeamID.push(match.homeTeam.id);
            
            result.push({
                id: match.id,
                stage: stg,
                utcDate: date,
                homeTeam: home,
                awayTeam: away,
                lastUpdated: match.lastUpdated
            });
        }
        
        // try to request all team detail

        try {
            const response = await this._composePromise(requestTeamID);
            const jsonData = await Promise.all(response.map(resData => resData.json()));
            const retrievedEmblem = jsonData.map(r => r.crestUrl); // return array of emblem url

            // patch all emblemUrl to array
            for(let x = 0; x < retrievedEmblem.length; x++){
                let idx = result.findIndex(team => team.homeTeam.id === requestTeamID[x]);
                if(idx > -1)
                    result[idx].homeTeam.emblem = retrievedEmblem[x];
                
                idx = result.findIndex(team => team.awayTeam.id === requestTeamID[x]);
                if(idx > -1)
                    result[idx].awayTeam.emblem = retrievedEmblem[x];
            }
        } catch(error){
            console.error(error);
        }
        return result;
    }
    _composePromise(requestTeamID){
        const requests = [];
        requestTeamID.forEach(id => {
            requests.push(fetchUrl(apis.team(id)));
        });

        return Promise.all(requests);
    }
}

export default NextMatch;