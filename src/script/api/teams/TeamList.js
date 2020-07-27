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
  * to get the team list before visualized by view's code 
  */

import {apis} from '../base/api_methods';
import ModelClass from '../base/ModelClass';

class TeamList extends ModelClass {
    constructor() {
        super();
        this._leagueId = 2001; // default is UEFA Champions League
    }

    set leagueId(newId) {
        this._leagueId = newId;
    }

    get apiMethod() {
        return apis.list_teams(this._leagueId);
    }

    async _serveData(jsonData) {
        const result = [];
        jsonData.teams.forEach(team => {
            result.push({
                id: team.id,
                name: team.name,
                area: team.area.name,
                emblem: team.crestUrl
            });
        });
        return result;
    }
}

export default TeamList;