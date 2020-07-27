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

class TeamCompetitions extends HTMLElement {
    constructor() {
        super();
        this._data = null;
    }

/**
 * {
        league_name: name,
        league_emblem: null
    }
 */

    set data(nData){
        this._data = nData;
    }

    update() {
        if(this._data)
            this._render();
    }

    _render(){
        const d = this._data;
        d.league_emblem = staticFunc.exportToHttps(d.league_emblem);

        this.innerHTML = `

            <style>
                .row {
                    margin-bottom: unset;
                }
            </style>
            <div class='card waves waves-light'>
                <div class='card-content' style='padding:12px;border-radius: 6px 6px;'>
                    <div class='row'>
                        <div class='col s3'>
                            <img src='${d.league_emblem ? d.league_emblem: '/images/others/nav-icon.png'}' style='margin-top:auto;margin-bottom: auto;' class='responsive-img' alt='Logo' id='clubCompetitions'>
                        </div>
                        <div class='col s9'>
                            <h6 id='competitionName' style='font-weight:bold;'>${d.league_name}</h6>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.querySelector('#clubCompetitions').addEventListener('error', (event) => {
            event.target.src = '/images/others/nav-icon.png';
            this._centeringTextCompetition();
        });

        this.querySelector('#clubCompetitions').addEventListener('load', (event) => {
            this._centeringTextCompetition();
        });
    }

    _centeringTextCompetition(){
        const h = $(this.querySelector('#clubCompetitions')).height();
        const q = $(this.querySelector('#competitionName')).height();
        const m = (h/2) - (q/2);
        if(m>0)
            $(this.querySelector('#competitionName')).css({
                'margin': `${m}px 0`
            });
    }
}

customElements.define('competition-team', TeamCompetitions);