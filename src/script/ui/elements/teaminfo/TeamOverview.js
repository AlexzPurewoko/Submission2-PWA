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

import './TeamInformation';
import {staticFunc} from '../../../constants/all_constant';

class TeamOverview extends HTMLElement {
    constructor() {
        super();
        this._data = null;
    }

    /*
        {
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
    */

    set data(newData){
        this._data = newData;
    }

    update(){
        this._render();
    }
    _render() {
        if(this._data === null) return;
        this._data.emblem = staticFunc.exportToHttps(this._data.emblem);
        
        this.innerHTML = `
            <div class='card'>
                <div class='card-content'>
                    <div class='row'>
                        <div class='col s12'>
                            <img 
                                style='display: block;margin-left: auto;margin-right: auto;width: 70%;'
                                src='${this._data.emblem ? this._data.emblem: '/images/others/nav-icon.png'}' 
                                class='responsive-img' alt='Logo'>
                        </div>
                        <div class='col s12'>
                            <h5 class='center-align'>${this._data.name ? this._data.name : "No name"}</h5>
                        </div>
                        <div class='col s12'>
                            <p class='center-align'>${this._data.areaName ? this._data.areaName : "-"} (${this._data.founded ? this._data.founded : "-"})</p>
                        </div>
                        <div class='col s12' style='margin-top:10px'>
                            <team-info></team-info>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const f = this.querySelector('team-info');
        f.data = this._data;
        f.update();
    }
}

customElements.define('team-overview', TeamOverview);

