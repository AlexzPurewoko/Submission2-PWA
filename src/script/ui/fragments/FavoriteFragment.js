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


import FragmentUIHolder from '../base/FragmentUIHolder';

import MainFootballDB from '../../database/MainFootballDB';
import $ from 'jquery';
import {key} from '../../constants/all_constant';
import DBCallbacks from '../../database/DBCallbacks';

class FavoriteFragment extends FragmentUIHolder {
    constructor() {
        super();

        // currently load data from Database ?
        this._isLoading = {
            match: false,
            teams: false
        };

        this._hasFirst = false;

        // managing the sub view
        this._subView = null;
        this._mView = null;

        this._observeOnDataChanged = new DBCallbacks();
        this._observeOnDataChanged.callbacks = (e) => {this._loadAndApplyFromDB();};

        // indicates the tab condition: [ MATCH | TEAMS ]
        this._currentTabs = 'MATCH';
    }

    get title() {
        return 'My Favorites';
    }

    get isTabEnabled() {
        return true;
    }

    onRenderPage() {
        if(!this._hasFirst){
            this._hasFirst = true;
            this.dbOperation.addCallbacks(this._observeOnDataChanged);
        }
            this.innerHTML = `
                <div class='row' style='margin:0;' id='matchs'>
                    <loading-circle style='display:none;'></loading-circle>
                    <error-page style='display:none;'></error-page>
                    <div class='row' id='pmatchs' style='display:none;'></div>
                </div>
                <div class='row' style='margin:0;'  id='teams'>
                    <loading-circle style='display:none;'></loading-circle>
                    <error-page style='display:none;'></error-page>
                    <div class='row' id='pteams' style='display:none;'></div>
                </div>
            `;

            const match = this.querySelector('#matchs');
            const teams = this.querySelector('#teams');
            $(teams).hide();

            this._mView = {
                match: {
                    parent: match,
                    loading: match.querySelector('loading-circle'),
                    errorPage: match.querySelector('error-page'),
                    mainPage: match.querySelector('#pmatchs'),
                },
                teams: {
                    parent: teams,
                    loading: teams.querySelector('loading-circle'),
                    errorPage: teams.querySelector('error-page'),
                    mainPage: teams.querySelector('#pteams'),
                }
            }

            // firstly load from PAST tabs
            this._subView = this._mView.past;
            this._loadAndApplyFromDB();
    }

    async _loadAndApplyFromDB() {
        this._showUI('load', this._mView.match);
        this._showUI('load', this._mView.teams);
        const matchsData = await this.dbOperation.getAllData(MainFootballDB.MATCH_FAVORITE_STORE);
        const teamsData = await this.dbOperation.getAllData(MainFootballDB.TEAM_FAVORITE_STORE);
        if(matchsData.length > 0){
            this._renderListMatchs(matchsData, this._mView.match);
            this._showUI('main', this._mView.match)
        } else {
            this._showUI('error', this._mView.match);
            $(this._mView.match.errorPage).attr('message', "No Data Available");
        }

        if(teamsData.length > 0){
            this._renderListTeams(teamsData, this._mView.teams);
            this._showUI('main', this._mView.teams)
        } else {
            this._showUI('error', this._mView.teams);
            $(this._mView.teams.errorPage).attr('message', "No Data Available");
        }

    }

    _renderListMatchs(data, targetV){
        const mainPage = targetV.mainPage;
        $(mainPage).empty();
        data.forEach(item => {
            const matchElement = $('<match-element>');
            matchElement[0].data = item;
            matchElement[0].dbOperation = {
                db: this.dbOperation,
                store: MainFootballDB.MATCH_FAVORITE_STORE
            };
            matchElement[0].update();
            const colElement = $(`
                <div class='col s12 m6'>
                </div>
            `);
            colElement.append(matchElement);
            $(mainPage).append(colElement);
        });
    }

    _renderListTeams(data, targetV){
        const mainPage = targetV.mainPage;
        $(mainPage).empty();
        data.forEach(item => {
            const teamElement = $('<team-card>');
            teamElement[0].data = item;
            teamElement[0].eventClick = (e, id) => {
                M.toast({html: `Selected item id: ${id}`});
                this.sendCommands(key.TEAMSFG_SEND_TO_DETAIL, {
                    name: 'fragment-detail-team',
                    value: item
                })
            }
            teamElement[0].update();
            const colElement = $(`
                <div class='col s12 m6'>
                </div>
            `);
            colElement.append(teamElement);
            $(mainPage).append(colElement);
        });
    }

    onSaveState() {
    }

    onCreateTabs(tabElement){
        tabElement.innerHTML = `
            <li class="tab" id='nav-match'><a class='waves-effect active'>MATCH</a></li>
            <li class="tab" id='nav-teams'><a class="waves-effect">TEAMS</a></li>
        `;

        tabElement.querySelector('#nav-match').addEventListener('click', (e) => {
            if(this._currentTabs === 'MATCH') return;
            $(this._mView.teams.parent).hide();
            $(this._mView.match.parent).show();
            this._subView = this._mView.past;
            this._currentTabs = 'MATCH';
        });
        tabElement.querySelector('#nav-teams').addEventListener('click', (e) => {
            if(this._currentTabs === 'TEAMS') return;
            $(this._mView.match.parent).hide();
            $(this._mView.teams.parent).show();
            this._subView = this._mView.next;
            this._currentTabs = 'TEAMS';
        });
        return true;
    }

    // PRIVATE
    _showUI(type = 'main', vTarget = this._subView){
        if(type === 'load'){
            $(vTarget.loading).show();
            $(vTarget.mainPage).hide();
            $(vTarget.errorPage).hide();

        } else if(type === 'error'){
            $(vTarget.errorPage).show();
            $(vTarget.mainPage).hide();
            $(vTarget.loading).hide();
        } else if(type === 'main'){
            $(vTarget.mainPage).show();
            $(vTarget.loading).hide();
            $(vTarget.errorPage).hide();

        }
    }
}

customElements.define('fragment-favorite', FavoriteFragment);
