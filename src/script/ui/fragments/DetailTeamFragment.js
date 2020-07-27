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
import DetailTeam from '../../api/teams/DetailTeam';
import ModelClass from '../../api/base/ModelClass';

import $ from 'jquery';
import M from 'materialize-css';
import MainFootballDB from '../../database/MainFootballDB';

class DetailTeamFragment extends FragmentUIHolder {
    constructor() {
        super();
        this._hasFirst = false;
        this._isLoading = false;
        this._loadAPI = new DetailTeam();
        this._loadAPI.callbacks = {
            onFinished: (data) => this.onFinishedAPIResult(data),
            onLoad: () => this.onLoadFromAPI()
        };

        this._subView = {
            favorite: null,
            loading: null,
            errorPage: null,
            mainPage: null
        };
    }

    get title() {
        return 'Detail Team';
    }

    get toggleType() {
        return 'back';
    }

    get isOptionMenuEnabled() {
        return true;
    }

    onRenderPage() {
            this.innerHTML = `

                <loading-circle style='display: none;'></loading-circle>
                <error-page style='display: none;'></error-page>
                <div style='margin: 0;display: none;' class='row' id='detailTeam'>
                    <div class='col s12 m6'>
                        <team-overview></team-overview>
                    </div>
                    <div class='col s12 m6'>
                        <div class='row' id='competitionList'>
                        </div>
                        <div class='row' id='squadList'>
                        </div> 
                    </div>
                </div>
            `;

            this._subView.mainPage = {
                parent: this.querySelector('#detailTeam'),
                teamOverview: this.querySelector('team-overview'),
                competitionList: this.querySelector('#competitionList'),
                squadList: this.querySelector('#squadList')
            };

            this._subView.loading = this.querySelector('loading-circle');
            this._subView.errorPage = this.querySelector('error-page');

            this._hasFirst = true;
            this._loadAPI.teamId = this.arguments.id;
            this._loadAPI.startLoad();
    }

    onSaveState() {

    }

    onCreateOptionsMenu(menuElement){
        menuElement.innerHTML = `
            <li id='toolbar-favorite' class='waves-effect tooltipped' data-position='left' data-tooltip='Add to Favorites'>
                <a><i class='material-icons'>favorite_border</i></a>
            </li>
        `;

        this._subView.favorite = menuElement.querySelector('#toolbar-favorite');
        $(this._subView.favorite).addClass('disabled');
        const bFunc = async _ => {
            const hasFavorite = await this.dbOperation.anyData(MainFootballDB.TEAM_FAVORITE_STORE, this.arguments.id);
            if(hasFavorite){
                $(this._subView.favorite).children().children().text('favorite');
                $(this._subView.favorite).attr('data-tooltip', 'Remove from Favorite');
                M.toast
            } else {
                $(this._subView.favorite).children().children().text('favorite_border');
                $(this._subView.favorite).attr('data-tooltip', 'Add to Favorite');
            }
            $(this._subView.favorite).parent().removeClass('disabled');
            return hasFavorite;
        }
        bFunc();

        // implement onclicks
        this._subView.favorite.addEventListener('click', _ => {
            const target = event.target;
            if(!$(target).hasClass('material-icons')) return;
            $(target).parent().addClass('disabled');
            const aFunc = async _ => {
                const hasFavorite = await this.dbOperation.anyData(MainFootballDB.TEAM_FAVORITE_STORE, this.arguments.id);
                if(hasFavorite){
                    await this.dbOperation.deleteData(MainFootballDB.TEAM_FAVORITE_STORE, this.arguments.id);            
                } else {
                    await this.dbOperation.addData(MainFootballDB.TEAM_FAVORITE_STORE, this.arguments);
                }
                const validate = await bFunc();
                if(validate) M.toast({html: 'Added into favorite'});
                else M.toast({html: 'Deleted from favorite'});

            }
            aFunc();
            
        });
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
            this._buildOverview(data.data.info);
            this._buildCompetitions(data.data.competitions);
            this._buildPlayers(data.data.allPlayers);
            this._showUI();
        }
    }

    onLoadFromAPI(){
        this._isLoading = true;
        this._showUI('load');
    }

    // PRIVATE
    _showUI(type = 'main'){
        if(type === 'load'){
            $(this._subView.loading).show();
            $(this._subView.mainPage.parent).hide();
            $(this._subView.errorPage).hide();
            

        } else if(type === 'error'){
            $(this._subView.errorPage).show();
            $(this._subView.mainPage.parent).hide();
            $(this._subView.loading).hide();
            
        } else if(type === 'main'){
            $(this._subView.mainPage.parent).show();
            $(this._subView.loading).hide();
            $(this._subView.errorPage).hide();

        }
    }

    _buildTitle(title){
        return $(`
            <div class='col s12'>
                <h6><b>${title}</b></h6>
            </div>
        `);
    }

    _buildOverview(teamOverview){
        this._subView.mainPage.teamOverview.data = teamOverview;
        this._subView.mainPage.teamOverview.update();
    }

    _buildCompetitions(competitionData){
        $(this._subView.mainPage.competitionList).empty();
        $(this._subView.mainPage.competitionList).append(
            this._buildTitle(
                `Active Competitions<span class='right'>(${competitionData.length})</span>`
            )
        );
        competitionData.forEach(competition => {
            const teamElement = $('<competition-team>');
            teamElement[0].data = competition;
            teamElement[0].update();
            const colElement = $(`
                <div class='col s12'>
                </div>
            `);
            colElement.append(teamElement);
            $(this._subView.mainPage.competitionList).append(colElement);
        });
    }

    _buildPlayers(teamSquad){
        $(this._subView.mainPage.squadList).empty();
        $(this._subView.mainPage.squadList).append(
            this._buildTitle(
                `All Squads<span class='right' >(${teamSquad.length})</span>`
            )
        );
        teamSquad.forEach(squad => {
            const squadElement = $('<team-squad>');
            squadElement[0].data = squad;
            squadElement[0].update();
            const colElement = $(`
                <div class='col s12'>
                </div>
            `);
            colElement.append(squadElement);
            $(this._subView.mainPage.squadList).append(colElement);
        });
    }
    
}

customElements.define('fragment-detail-team', DetailTeamFragment);