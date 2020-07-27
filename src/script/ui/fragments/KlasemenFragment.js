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
import M from 'materialize-css';
// import apis
import KlasemenModel from '../../api/klasemen/KlasemenModel';
import ModelClass from '../../api/base/ModelClass';
import CompetitionInfo from '../../api/competitions/CompetitionInfo';

import $ from 'jquery';
class KlasemenFragment extends FragmentUIHolder {
    constructor() {
        super();
        this._hasFirst = false;
        this._isLoading = false;
        this._loadAPI = new KlasemenModel();
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
        this._filterData = null;
    }

    get title() {
        return 'Klasemen';
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
                <div id='mainKlasemen' style='display: none;'>

                </div>
            `;

            this._subView = {
                loading: this.querySelector('loading-circle'),
                errorPage: this.querySelector('error-page'),
                mainPage: this.querySelector('#mainKlasemen'),
                championInfo: this.querySelector('champion-info'),
                clubLeagueList: null,
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
            console.error(data.data);
            $(this._subView.errorPage).attr('message', data.message);
        } else if(data.status === ModelClass.STATUS_SUCCESS){
            this._composeData(data.data);
            this._applyAndDisplay();
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

        } else if(type === 'error'){
            $(this._subView.errorPage).show();
            $(this._subView.mainPage).hide();
            $(this._subView.loading).hide();
        } else if(type === 'main'){
            $(this._subView.mainPage).show();
            $(this._subView.loading).hide();
            $(this._subView.errorPage).hide();

        }
    }

    _composeData(dataStandings){
        const dataStage = [];
        const dataGroup = [];
        const dataType  = [];
        const rawData = dataStandings;

        rawData.forEach(data => {
            if(!dataStage.includes(data.stage))
                dataStage.push(data.stage);
            
            if(!dataGroup.includes(data.group))
                dataGroup.push(data.group);
            
            if(!dataType.includes(data.type))
                dataType.push(data.type);
        })

        this._filterData = {
            stages: dataStage,
            groups: dataGroup,
            types: dataType,
            raw: rawData,
            filterScheme: [
                // STAGE, GROUP, TYPES
            ]
        };
    }

    _applyAndDisplay(){
        this._showUI();
        const stage1 = this._filterData.stages[0];
        const group1 = this._filterData.groups[0];
        const type1 = this._filterData.types[0];
        const iConcatFunc = (elements, p1) => {
            let result = '';
            elements.forEach(item => {
                result += `
                    <li class='waves waves-light ${item===p1?'active':''}'><a href="#!">${item}</a></li>
                `;
            })
            return result;
        }
        const createdD1 = iConcatFunc(this._filterData.stages, stage1);
        const createdD2 = iConcatFunc(this._filterData.groups, group1);
        const createdD3 = iConcatFunc(this._filterData.types, type1);
        
        this._subView.mainPage.innerHTML = `
            <div class='row'>
                <div class='row'>
                    <a id='StageButton' class='onLeft dropdwon-trigger waves-light btn waves-effect waves-light red darken-4' data-target='StageDropdown'>
                        <i class='material-icons right'>expand_more</i>${stage1}
                    </a>
                    <ul id='StageDropdown' class='dropdown-content'>
                        ${createdD1}
                    </ul>
                    <a style='margin-left: 16px;' id='GroupButton' class='onLeft dropdwon-trigger waves-light btn waves-effect waves-light light-blue darken-4' data-target='GroupDropdown'>
                        <i class='material-icons right'>expand_more</i>${group1}
                    </a>
                    <ul id='GroupDropdown' class='dropdown-content'>
                        ${createdD2}
                    </ul>
                    <a id='TypeButton' class='onRight dropdwon-trigger waves-light btn waves-effect waves-light grey darken-4' data-target='TypeDropdown'>
                        <i class='material-icons right'>expand_more</i>${type1}
                    </a>
                    <ul id='TypeDropdown' class='dropdown-content'>
                        ${createdD3}
                    </ul>
                </div>
                <div class='row'>
                    <club-league-list></club-league-list>
                </div>
            </div>
        `;

        this._subView.clubLeagueList = this._subView.mainPage.querySelector('club-league-list');
        this._filterData.filterScheme = [stage1, group1, type1];

        const dropdowns = [
            ['#StageButton', '#StageDropdown', 'STAGE'],
            ['#GroupButton', '#GroupDropdown', 'GROUP'],
            ['#TypeButton', '#TypeDropdown', 'TYPE']
        ];
        dropdowns.forEach(a => {
            const c = this._subView.mainPage.querySelector(a[0]);
            const d = this._subView.mainPage.querySelector(a[1]);
            M.Dropdown.init(c);
            d.addEventListener('click', (e) => {
                const parentUl = $(event.target).parent().parent();
                
                parentUl.children().each((index, element) => {
                    $(element).removeClass('active');
                });
                $(event.target).parent().addClass('active');
                $(c).html(`
                    <i class='material-icons right'>expand_more</i>${event.target.innerText}
                `); 
                this._eventDropdownCallbacks(event.target.innerText, a[2]);
            });
        });
        
        this._filterAndShow();
    }

    /**
     * 
     * @param {string} item item that be a sub on parameter from
     * @param {string} from must be a one of [STAGE, GROUP, TYPE]
     */
    _eventDropdownCallbacks(item, from){
        const isNew = (oldVal) => oldVal !== item
        switch(from){
            case 'STAGE':
                if(isNew(this._filterData.filterScheme[0])){
                    this._filterData.filterScheme[0] = item;
                }
                break;
            case 'GROUP':
                if(isNew(this._filterData.filterScheme[1])){
                    this._filterData.filterScheme[1] = item;
                }
                break;
            case 'TYPE':
                if(isNew(this._filterData.filterScheme[2])){
                    this._filterData.filterScheme[2] = item;
                }
                break;
            default:
                return;
        }

        this._filterAndShow();
    }

    _filterAndShow() {
        if(!this._filterData.filterScheme) return;
        if(this._filterData.filterScheme.length != 3) return;
        
        const rawData = this._filterData.raw;
        // STAGE, GROUP, TYPES
        //     0,     1,     2
        const filter = this._filterData.filterScheme;

        const filteredData = rawData.filter(
            d => d.stage === filter[0] && d.group === filter[1] && d.type === filter[2]
        );
        this._subView.clubLeagueList.data = filteredData[0].table;
    }
}

customElements.define('fragment-klasemen', KlasemenFragment);