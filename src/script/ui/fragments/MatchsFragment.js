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
import NextMatch from '../../api/matchs/NextMatch';
import PastMatch from '../../api/matchs/PastMatch';
import ModelClass from '../../api/base/ModelClass';
import CompetitionInfo from '../../api/competitions/CompetitionInfo';

import $ from 'jquery';
import M from 'materialize-css';
import MainFootballDB from '../../database/MainFootballDB';
class MatchsFragment extends FragmentUIHolder {
    constructor() {
        super();

        // is first rendering?
        this._hasFirst = false;

        // currently load data from API ?
        this._isLoading = {
            past: false,
            next: false
        };

        // first time call loadALL ?
        this._hasFirstCall = {
            past: false,
            next: false
        };

        // store the error information

        // API Handler
        this._loadAPIPast = new PastMatch(); // past match
        this._loadAPINext = new NextMatch(); // next match
        this._competitionInfoAPI = new CompetitionInfo(); // display competition info

        // initializes callbacks
        this._loadAPIPast.callbacks = {
            onFinished: (data) => this.onFinishedAPIResult(data, 'PAST'),
            onLoad: () => this.onLoadFromAPI('PAST')
        }; // callbacks for past match
        this._loadAPINext.callbacks = {
            onFinished: (data) => this.onFinishedAPIResult(data, 'NEXT'),
            onLoad: () => this.onLoadFromAPI('NEXT')
        }; // callbacks for next match

        // to indicate the current condition of display info competition
        this._infoCompetition = null;
        this._competitionInfoAPI.callbacks = {
            onFinished: (data) => {
                if(!data) return;
                if(data.status === ModelClass.STATUS_FAILED){
                    M.toast({html: 'Failed to load Competition info!'})
                } else if(data.status === ModelClass.STATUS_SUCCESS){
                    this._infoCompetition = data.data;
                    if(this._mView){
                        this._mView.championInfo.data = data.data;
                    }
                }
            },
            onLoad: _ => this._infoCompetition = 'load'
        }

        // managing the sub view
        this._subView = null;
        this._mView = null;

        // indicates the tab condition: [ PAST | NEXT ]
        this._currentTabs = 'PAST';
    }

    get title() {
        return 'Matchs';
    }

    get isOptionMenuEnabled() {
        return true;
    }

    get isTabEnabled() {
        return true;
    }

    onFinishedAPIResult(data, tabMode){
        let targetV = null;
        switch(tabMode){
            case 'PAST':
                this._isLoading.past = false;
                targetV = this._mView.past;
                break;
            case 'NEXT':
                this._isLoading.next = false;
                targetV = this._mView.next;
                break;
            default:
                return;
        }
        
        if(data == null){
            this._showUI('error', targetV);
            $(targetV.errorPage).attr('message', 'Data is Null');
        } else if(data.status === ModelClass.STATUS_FAILED){
            this._showUI('error', targetV);
            $(targetV.errorPage).attr('message', data.message);
        } else if(data.status === ModelClass.STATUS_SUCCESS){
            if(data.data.type === 'LOAD_FIRST'){
                targetV.pagination.count = data.data.pageCount;
                targetV.pagination.update();
                switch(tabMode){
                    case 'PAST':
                        this._loadAPIPast.startLoadPage();
                        break;
                    case 'NEXT':
                        this._loadAPINext.startLoadPage();
                        break;
                }
            } else if(data.data.type === 'LOAD_PAGE'){
                this._renderListMatchs(data.data.res, targetV);
                this._showUI('main', targetV);
            }
        }
        
    }

    onLoadFromAPI(tabMode){
        switch(tabMode){
            case 'PAST':
                this._isLoading.past = true;
                this._showUI('load', this._mView.past);
                break;
            case 'NEXT':
                this._isLoading.next = true;
                this._showUI('load', this._mView.next);
        }
    }

    onRenderPage() {
        if(!this._hasFirst){
            this.innerHTML = `
                <champion-info></champion-info>
                <div class='row' style='margin:0;' id='past-match'>
                    <loading-circle style='display:none;'></loading-circle>
                    <error-page style='display:none;'></error-page>
                    <div class='row' id='pmatch' style='display:none;'></div>
                    <pagination-element id='past-pagination'></pagination-element>
                </div>
                <div class='row' style='margin:0;' id='next-match'>
                    <loading-circle style='display:none;'></loading-circle>
                    <error-page style='display:none;'></error-page>
                    <div class='row' id='nmatch' style='display:none;'></div>
                    <pagination-element id='next-pagination'></pagination-element>
                </div>
            `;

            const pastDiv = this.querySelector('#past-match');
            const nextDiv = this.querySelector('#next-match');
            $(nextDiv).hide();

            this._mView = {
                championInfo: this.querySelector('champion-info'),
                past: {
                    parent: pastDiv,
                    loading: pastDiv.querySelector('loading-circle'),
                    errorPage: pastDiv.querySelector('error-page'),
                    mainPage: pastDiv.querySelector('#pmatch'),
                    pagination: pastDiv.querySelector('#past-pagination'),
                },
                next: {
                    parent: nextDiv,
                    loading: nextDiv.querySelector('loading-circle'),
                    errorPage: nextDiv.querySelector('error-page'),
                    mainPage: nextDiv.querySelector('#nmatch'),
                    pagination: nextDiv.querySelector('#next-pagination')
                }
            }

            // firstly load from PAST tabs
            this._subView = this._mView.past;

            this._mView.past.pagination.onClick = (num) => {
                this._onPageClicked(num, 'PAST');
            };

            this._mView.next.pagination.onClick = (num) => {
                this._onPageClicked(num, 'NEXT');
            };

            this._hasFirst = true;
            this._loadAPIPast.startLoad();
            this._hasFirstCall.past = true;
            this._competitionInfoAPI.startLoad();
        }
    }

    onSaveState() {
    }

    onCreateTabs(tabElement){
        tabElement.innerHTML = `
            <li class="tab" id='nav-past'><a class='waves-effect active'>PAST</a></li>
            <li class="tab" id='nav-next'><a class="waves-effect">NEXT</a></li>
        `;

        tabElement.querySelector('#nav-past').addEventListener('click', (e) => {
            if(this._currentTabs === 'PAST') return;
            $(this._mView.next.parent).hide();
            $(this._mView.past.parent).show();
            this._subView = this._mView.past;
            this._currentTabs = 'PAST';
        });
        tabElement.querySelector('#nav-next').addEventListener('click', (e) => {
            if(this._currentTabs === 'NEXT') return;
            $(this._mView.past.parent).hide();
            $(this._mView.next.parent).show();
            this._subView = this._mView.next;
            this._currentTabs = 'NEXT';

            if(!this._hasFirstCall.next){
                this._hasFirstCall.next = true;
                this._loadAPINext.startLoad();
            }
        });
        return true;
    }

    onCreateOptionsMenu(menuElement) {
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
                this._mView.championInfo.toggleModal();
            }
        });

        menuElement.querySelector('#toolbar-refresh').addEventListener('click', (event) => {
            if(this._currentTabs === 'PAST' && this._isLoading.past) return;
            if(this._currentTabs === 'NEXT' && this._isLoading.next) return;
            switch(this._currentTabs){
                case 'PAST':
                    this._loadAPIPast.startLoad();
                    break;
                case 'NEXT':
                    this._loadAPINext.startLoad();
                    break;
            }
        })
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

    _onPageClicked(num, vTarget){
        switch(vTarget){
            case 'PAST':
                this._loadAPIPast.startLoadPage(num);
                break;
            case 'NEXT':
                this._loadAPINext.startLoadPage(num);
                break;
        }
    }
}

customElements.define('fragment-match', MatchsFragment);