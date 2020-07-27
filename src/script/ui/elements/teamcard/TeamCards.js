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

import {staticFunc} from '../../../constants/all_constant';

class TeamCards extends HTMLElement {
    constructor() {
        super();
        this._data = null;
        this._eventClick = (event, teamId) => {};
    }

/**
 * {
        id: team.id,
        name: team.name,
        area: team.area.name,
        emblem: team.crestUrl
    }
 */

    set eventClick(nClick){
        if(nClick)
            this._eventClick = nClick;
    }

    set data(nData){
        this._data = nData;
    }

    update() {
        if(this._data)
            this._render();
    }

    _render(){
        const d = this._data;
        d.emblem = staticFunc.exportToHttps(d.emblem);
        this.innerHTML = `

            <style>

                .row {
                    margin-bottom: unset;
                }
                
            </style>
            <div class='card white-text waves waves-light' >
                <div class='card-content grey darken-3' style='padding:12px;border-radius: 6px 6px;'>
                    <div class='row'>
                        <div class='col s3'>
                            <img src='${d.emblem ? d.emblem: '/images/errors/warning-error.svg'}' class='responsive-img' alt='Logo ${d.name}' id='clubTeamPicture'>
                        </div>
                        <div class='col s9'>
                            <div class='row'>
                                <div class='col s12'>
                                    <h6 id='clubTeamName' style='font-weight:bold;'>${d.name}</h6>
                                </div>
                                <div class='col s12'>
                                    <p>${d.area}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.querySelector('#clubTeamPicture').addEventListener('error', (event) => {
            event.target.src = '/images/errors/warning-error.svg';
        })
        this.addEventListener('click', (event) => {
            this._eventClick(event, this._data.id);
        })
    }
}

customElements.define('team-card', TeamCards);