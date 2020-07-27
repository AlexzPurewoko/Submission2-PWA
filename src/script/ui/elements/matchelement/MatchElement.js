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

import $ from 'jquery';
import {staticFunc} from '../../../constants/all_constant';
import DBCallbacks from '../../../database/DBCallbacks';

class MatchElement extends HTMLElement {
    constructor() {
        super();
        this._starClick = (event) => {this.toggleStar()};
        this._observeDbCallbacks = new DBCallbacks();
        this._observeDbCallbacks.callbacks = (db) => {this._checkFavorite();};
    }

    disconnectedCallback(){
        if(this._dbOperation)
            this._dbOperation.removeCallbacks(this._observeDbCallbacks);
    }

    set starEventClick(eventClick){
        if(eventClick){
            this._starClick = eventClick;
        }
    }

    set data(nData){
        this._data = nData;
    }

    set dbOperation(db){
        this._dbOperation = db.db;
        this._storeData = db.store;
        this._dbOperation.addCallbacks(this._observeDbCallbacks);
    }

    get isStarToggled(){
        const elm = this.querySelector('#starClub');
        if(elm.innerText === 'star'){
            return true;
        } 
        return false;
    }

    set isStarToggled(condition){
        const elm = this.querySelector('#starClub');
        if(condition){
            elm.innerText = 'star';
        } else {
            elm.innerText = 'star_outline';
        }
    }



    toggleStar(){
        this.isStarToggled = !this.isStarToggled;
    }

    update(){
        this._render();
    }

    _render() {

        if(!this._data) return;

        const color = [
            'red',
            'indigo',
            'grey',
            'blue-grey'
        ];

        const selected = color[this._random(color.length)];

        /*
[
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
        */

        const d = this._data;
        d.homeTeam.emblem = staticFunc.exportToHttps(d.homeTeam.emblem);
        d.awayTeam.emblem = staticFunc.exportToHttps(d.awayTeam.emblem);
        this.innerHTML = `
            <div class='card white-text'>
                <div class='card-image ${selected} darken-4'>
                    <p style='font-size:small;padding:6px;margin-bottom:0;'>${d.stage} <i id='starClub' class='disabled material-icons right waves waves-light' style='font-size:20px;'>star_outline</i></p>
                </div>
                <div class='card-content ${selected} darken-3'>
                    <div class='row' style='margin-bottom: unset;'>
                        <div class='row' style='margin-bottom: unset;'>
                            <div class='col s4'>
                                <img id='homeClub' class='imageClub' alt='HomeTeam' src='${(d.homeTeam.emblem) ? d.homeTeam.emblem : '/images/errors/warning-error.svg'}'>
                            </div>
                            <div class='col s4' style='padding-left:unset;padding-right:unset'>
                                    <div id='scoreClub' class='row' style='margin-top:auto;margin-bottom:auto;'>
                                        <div class='col s4' style='padding-left:unset;padding-right:unset'>
                                            <p class='center-align' style='font-weight:bold;font-size:medium;'>${this._isNull(d.homeTeam.score) ? '-' : d.homeTeam.score}</p>
                                        </div>
                                        <div class='col s4' style='padding-left:unset;padding-right:unset'>
                                            <p class='center-align' style='font-weight:bold;font-size:medium;'>Vs</p>
                                        </div>
                                        <div class='col s4' style='padding-left:unset;padding-right:unset'>
                                            <p class='center-align' style='font-weight:bold;font-size:medium;'>${this._isNull(d.awayTeam.score) ? '-' : d.awayTeam.score}</p>
                                        </div>
                                    </div>
                            </div>
                            <div class='col s4'>
                                <img id='awayClub' class='imageClub' alt='AwayTeam' src='${(d.awayTeam.emblem) ? d.awayTeam.emblem : '/images/errors/warning-error.svg'}' onload="console.log('p1 loaded');">
                            </div>
                        </div>
                        <div class='row'>
                            <div class='col s4'>
                                <p class='center-align'>${d.homeTeam.name}</p>
                            </div>
                            <div class='col s4'></div>
                            <div class='col s4'>
                                <p class='center-align'>${d.awayTeam.name}</p>
                            </div>
                        </div>
                        <div class='row' style='margin-bottom: unset;'>
                            <div class='col s12'>
                                <p class='center-align'>Last Updated ${d.lastUpdated}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.querySelector('#starClub').addEventListener('click', async (e) => {
            if(this._starClick){
                this._starClick(event);
            }
            $(this.querySelector('#starClub')).addClass('disabled');
            const anyData = await this._dbOperation.anyData(this._storeData, this._data.id);
            if(anyData){
                await this._dbOperation.deleteData(this._storeData, this._data.id);
            } else {
                await this._dbOperation.addData(this._storeData, this._data);
            }
            await this._checkFavorite();
        });
        this._setImgCb(this.querySelector('#homeClub'));
        this._setImgCb(this.querySelector('#awayClub'));

        this._checkFavorite();
    }

    async _checkFavorite() {
        const anyData = await this._dbOperation.anyData(this._storeData, this._data.id);
        this.isStarToggled = anyData;
        $(this.querySelector('#starClub')).removeClass('disabled');
    }

    _setImgCb(target){
        target.addEventListener('error', (event) => event.target.src = '/images/errors/warning-error.svg');
        target.addEventListener('load', (event) => {
            const elementScore = $(this.querySelector('#scoreClub'));
            const imageHeight = $(event.target).height();
            const heightScoreClub = elementScore.height();
            const computedMargins = (imageHeight/2) - (heightScoreClub/2);

            elementScore.css({
                'margin' : `${computedMargins}px 0`
            });
        })
    }

    _isNull(obj){
        return obj === null || obj === undefined;
    }

    _random(max){
        return Math.floor(Math.random() * Math.floor(max));
    }
}

customElements.define('match-element', MatchElement);