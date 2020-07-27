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
  * A MainActivity's module. Implemented from NavigationUIController
  * that managed all fragments.
  * You can store as many as you want fragment here
  * and provide the handling of UI.
  */

import NavigationUIController from '../base/NavigationUIController';
import M from 'materialize-css';

// import all fragments
import '../fragments/all';
import {key} from '../../constants/all_constant';
import MainFootballDB from '../../database/MainFootballDB';

const dbFootball = new MainFootballDB();
const _listFragments = [
    'fragment-klasemen',
    'fragment-match',
    'fragment-teams',
    'fragment-favorite',
    'fragment-aboutme',
    'fragment-detail-team'
];
const _sidenavContentList = [
    // ids, content
    ['sidenav-klasemen', '<i class="material-icons white-text">dashboard</i>Klasemen'],
    ['sidenav-matchs', '<i class="material-icons white-text">event</i>Matchs'],
    ['sidenav-teams', '<i class="material-icons white-text">people</i>Teams'],
    ['sidenav-favorite', '<i class="material-icons white-text">favorite</i>Favorite'],
    ['sidenav-about', '<i class="material-icons white-text">info</i>About Me'],
];
class MainActivity extends NavigationUIController {
    constructor() {
        super();
    }
    
    get fragments() {
        return _listFragments;
    }

    get sidenavContent() {
        return _sidenavContentList;
    }

    get databaseImpl() {
        return dbFootball;
    }

    init() {
        super.init();
        this._showFirstUI();
    }

    onSideNavItemClicked(ids, element, event){
        switch(ids){
            case 'sidenav-klasemen':
                this.changeFragments(this.fragments[0]);
                break;
            case 'sidenav-matchs':
                this.changeFragments(this.fragments[1]);
                break;
            case 'sidenav-teams':
                this.changeFragments(this.fragments[2]);
                break;
            case 'sidenav-favorite':
                this.changeFragments(this.fragments[3]);
                break;
            case 'sidenav-about':
                this.changeFragments(this.fragments[4]);
                break;
        }
        return super.onSideNavItemClicked(ids, element, event);
    }

    async onFragmentChange(fragment){
        const fgIdx = this._fragments.findIndex(a => a.title === fragment.title);
        if(fgIdx < 0) return;
        this._selectSideNavPositionByFg(this.fragments[fgIdx]);
        const newData = {
            id: 1,
            fragment_id: this.fragments[fgIdx],
            toggleType: fragment.toggleType,
            data: fragment.arguments
        };
        await this.databaseImpl.setData(MainFootballDB.CURRENT_STATE_FG_STORE, 1, newData);
    }

    sendCommands(keyCommand, value){
        switch(keyCommand){
            case key.TEAMSFG_SEND_TO_DETAIL: {
                if(this.fragments.includes(value.name))
                    this.changeFragments(value.name, value.value);
            }
        }
    }

    async _showFirstUI() {
        const savedStateUI = await this.databaseImpl.getByKey(MainFootballDB.CURRENT_STATE_FG_STORE, 1);
        if(!savedStateUI){
            this.changeFragments(this.fragments[0], null);
            //this._selectSideNavPositionByFg(this.fragments[0]);
            return;
        }
        M.toast({html: `Welcome back! Here the ${savedStateUI.fragment_id}`});
        if(savedStateUI.toggleType === 'back')
            this._pushStacks(this._fragments[0]);
        this.changeFragments(savedStateUI.fragment_id, savedStateUI.data);
        //this._selectSideNavPositionByFg(savedStateUI.fragment_id);
    }

    _selectSideNavPositionByFg(fgIds){
        switch(fgIds){
            case 'fragment-klasemen':
                this.sidenav.selectNav(0);
                break;
            case 'fragment-match':
                this.sidenav.selectNav(1);
                break;
            case 'fragment-detail-team':
            case 'fragment-teams':
                this.sidenav.selectNav(2);
                break;
            case 'fragment-favorite':
                this.sidenav.selectNav(3);
                break;
            case 'fragment-aboutme':
                this.sidenav.selectNav(4);
                break;
        }
    }
}

customElements.define('main-activity', MainActivity);