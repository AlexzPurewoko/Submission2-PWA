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
  * to get the detail team by id team before visualized by view's code 
  */

import {apis, fetchUrl} from '../base/api_methods';
import ModelClass from '../base/ModelClass';

class DetailTeam extends ModelClass {
    constructor() {
        super();
        this._teamId = 0;
    }

    set teamId(newId) {
        this._teamId = newId;
    }

    get apiMethod() {
        return apis.team(this._teamId);
    }

    async _serveData(jsonData) {
        const information = {
            name: jsonData.name,
            shortName: jsonData.shortName,
            founded: jsonData.founded,
            areaName: jsonData.area.name,
            emblem: jsonData.crestUrl,
            tla: jsonData.tla,
            address: jsonData.address,
            phone: jsonData.phone,
            website: jsonData.website,
            email: jsonData.email,
            venue: jsonData.venue,
            color: jsonData.clubColors
        }

        const activeCompetition = [];
        const requestEmblem = [];

        jsonData.activeCompetitions.forEach(competition => {
            const name = competition.name;

            requestEmblem.push(fetchUrl(apis.competition_info(competition.id)));
            activeCompetition.push({
                id: competition.id,
                league_name: name,
                league_emblem: null
            });
        });

        try {
            const response = await Promise.all(requestEmblem);
            const jsonData = await Promise.all(response.map(r => r.json()));
            const retrievedData = jsonData.map(d => [d.id, d.emblemUrl]);
            for(let x = 0; x < retrievedData.length; x++){
                const idx = activeCompetition.findIndex(p => p.id === retrievedData[x][0]);
                if(idx > -1)
                    activeCompetition[idx].league_emblem = retrievedData[idx][1];
            }
        } catch (error){
            console.error(error);
        }


        const squad = [];

        jsonData.squad.forEach(player => {
            squad.push({
                name: player.name,
                role: player.role,
                shirtNumber: player.shirtNumber
            });
        });

        return {
            info: information,
            competitions: activeCompetition,
            allPlayers: squad
        };
    }
}

export default DetailTeam;