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

// import apis
import TeamList from '../../api/teams/TeamList';
import ModelClass from '../../api/base/ModelClass';
import CompetitionInfo from '../../api/competitions/CompetitionInfo';

import $ from 'jquery';
import M from 'materialize-css';
import {key} from '../../constants/all_constant';
class TeamsFragment extends FragmentUIHolder {
    constructor() {
        super();
        this._hasFirst = false;
        this._isLoading = false;
        this._loadAPI = new TeamList();
        this._competitionInfoAPI = new CompetitionInfo();
        this._loadAPI.callbacks = {
            onFinished: (data) => this.onFinishedAPIResult(data),
            onLoad: () => this.onLoadFromAPI()
        };
        this._infoCompetition = null;
        this._competitionInfoAPI.callbacks = {
            onFinished: (data) => {
                if(!data) return;
                if(data.status === ModelClass.STATUS_FAILED){
                    M.toast({html: 'Failed to load Competition info!'})
                } else if(data.status === ModelClass.STATUS_SUCCESS){
                    this._infoCompetition = data.data;
                    if(this._subView){
                        this._subView.championInfo.data = data.data;
                    }
                }
            },
            onLoad: _ => this._infoCompetition = 'load'
        }

        this._subView = null;
        this._savedConf = {
            count: 0,
            pageCount: 0,
            currentPage: 0,
            currentItemInPage: 0,
            actuallyItemPerPage: 10,
            offsetItem: [0, 0],
            rawData: null
        }
    }

    get title() {
        return 'Teams';
    }

    get isOptionMenuEnabled() {
        return true;
    }

    onRenderPage() {

        if(!this._hasFirst){
            this.innerHTML = `
                <champion-info></champion-info>
                <loading-circle style='display: none;'></loading-circle>
                <error-page style='display: none;'></error-page>
                <div class='row' id='mainTeamList' style='display: none;'>

                </div>
                <pagination-element style='display: none;'></pagination-element>
            `;

            this._subView = {
                loading: this.querySelector('loading-circle'),
                errorPage: this.querySelector('error-page'),
                mainPage: this.querySelector('#mainTeamList'),
                championInfo: this.querySelector('champion-info'),
                pagination: this.querySelector('pagination-element')
            }

            this._subView.pagination.onClick = (num) => {
                this._applyConf(num);
            }

            this._hasFirst = true;
            this._competitionInfoAPI.startLoad();
            this._loadAPI.startLoad();
        }
        
    }

    onSaveState() {
    }

    onFinishedAPIResult(data){
        this._isLoading = false;
        if(data == null){
            this._showUI('error');
            $(this._subView.errorPage).attr('message', 'Data is Null');
        } else if(data.status === ModelClass.STATUS_FAILED){
            this._showUI('error');
            $(this._subView.errorPage).attr('message', data.message);
        } else if(data.status === ModelClass.STATUS_SUCCESS){
            this._reconfigure(data.data);
            this._applyConf();
            this._subView.pagination.count = this._savedConf.pageCount;
            this._subView.pagination.update();
            this._showUI();
        }
    }
    
    onLoadFromAPI(){
        this._showUI('load');
        this._isLoading = true;
    }

    onCreateOptionsMenu(menuElement){
        menuElement.innerHTML = `
            <li id='toolbar-info' class='waves-effect tooltipped' data-position='left' data-tooltip='Info Liga'>
                <a><i class='material-icons'>info</i></a>
            </li>
            <li id='toolbar-refresh' class='waves-effect tooltipped' data-position='left' data-tooltip='Reload'>
                <a><i class='material-icons'>refresh</i></a>
            </li>
        `;

        // implement onclicks
        menuElement.querySelector('#toolbar-info').addEventListener('click', _ => {
            if(!this._infoCompetition){
                M.toast({html: 'Cannot load data competition! Retrying...'});
                this._competitionInfoAPI.startLoad();
            } else if(this._infoCompetition === 'load'){
                M.toast({html: 'Wait for a moment please :)'});
            } else {
                // show the modals
                this._subView.championInfo.toggleModal();
            }
        });

        menuElement.querySelector('#toolbar-refresh').addEventListener('click', (event) => {
            if(!this._isLoading) 
                this._loadAPI.startLoad();
        })

        return true;
    }

    // PRIVATE
    _showUI(type = 'main'){
        if(type === 'load'){
            $(this._subView.loading).show();
            $(this._subView.mainPage).hide();
            $(this._subView.errorPage).hide();
            $(this._subView.pagination).hide();

        } else if(type === 'error'){
            $(this._subView.errorPage).show();
            $(this._subView.mainPage).hide();
            $(this._subView.loading).hide();
            $(this._subView.pagination).hide();
        } else if(type === 'main'){
            $(this._subView.mainPage).show();
            $(this._subView.pagination).show();
            $(this._subView.loading).hide();
            $(this._subView.errorPage).hide();

        }
    }

    _applyConf(page = 1){
        if(page < 1 || page > this._savedConf.pageCount) return;
        this._savedConf.currentPage = page;
        this._computeOffsetPage();

        $(this._subView.mainPage).empty();

        for(let x = this._savedConf.offsetItem[0] - 1; x < this._savedConf.offsetItem[1]; x++){
            const item = this._savedConf.rawData[x];
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
            $(this._subView.mainPage).append(colElement);
        }
    }

    _reconfigure(data){
        this._savedConf.count = data.length;
        this._savedConf.rawData = data;

        const a = data.length % this._savedConf.actuallyItemPerPage;
        const b = Math.floor(data.length / this._savedConf.actuallyItemPerPage) + (a > 0);
        this._savedConf.pageCount = b;
        
    }

    _computeOffsetPage(){
        const start = this._savedConf.actuallyItemPerPage * (this._savedConf.currentPage - 1) + 1;
        let end = start + this._savedConf.actuallyItemPerPage - 1;
        end = end > this._savedConf.count ? this._savedConf.count : end;

        this._savedConf.offsetItem = [start, end];
        this._savedConf.currentItemInPage = end - start + 1;
    }
}

customElements.define('fragment-teams', TeamsFragment);