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
 * {
          name: jsonData.name,
          areaName: jsonData.area.name,
          emblem: jsonData.emblemUrl,
          currentSeason: jsonData.currentSeason,
          lastUpdated: jsonData.lastUpdated
        }
 */
import M from 'materialize-css';
import {staticFunc} from '../../../constants/all_constant';

class ChampionInfoElement extends HTMLElement {
    constructor() {
        super();
        this._modalElement = null;
    }

    toggleModal(){
        if(this._modalElement)
            this._modalElement.open();
    }

    set data(d) {
        this._render(d);
    }

    _render(dataChampion){
        if(this._modalElement)
            this._modalElement.destroy();

        // change to https
        dataChampion.emblem = staticFunc.exportToHttps(dataChampion.emblem);
        this.innerHTML = `
            <div id='champion-data' class='modal'>
                <div class='modal-content'>
                    <div class='row' style='margin-bottom:0;'>

                        <div class='row'>
                            <div class='col s12'>
                                <img class='img-champion responsive-img' src='${dataChampion.emblem}' alt='Emblem League'>
                            </div>
                            <div class='col s12'>
                                <h5 class='center-align'>${dataChampion.name}</h5>
                            </div>
                        </div>

                        <div class='row' style='margin-bottom:0;'>
                            <div class='col s4'>
                                <div class='row'>
                                    <div class='col s12'>
                                        <p class='icon-item-champ no-margin'>
                                            <span class='material-icons'>event_available</span>
                                        </p>
                                    </div>
                                    <div class='col s12'>
                                        <p class='center-align no-margin'>${dataChampion.currentSeason.startDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div class='col s4'>
                                <div class='row'>
                                    <div class='col s12'>
                                        <p class='icon-item-champ no-margin'>
                                            <span class='material-icons'>event_note</span>
                                        </p>
                                    </div>
                                    <div class='col s12'>
                                        <p class='center-align no-margin'>${dataChampion.currentSeason.endDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div class='col s4'>
                                <div class='row'>
                                    <div class='col s12'>
                                        <p class='icon-item-champ no-margin'>${dataChampion.currentSeason.currentMatchday}</p>
                                    </div>
                                    <div class='col s12'>
                                        <p class='center-align no-margin'>Matchday</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class='row' style='margin-bottom:0;'>
                            <div class='col s12'>
                                <h6 class='center-align'>Last Updated<br>${dataChampion.lastUpdated}</h6>
                            </div>
                        </div>

                    </div>
                </div>
                <div class='modal-footer'>
                    <button class='modal-close waves-effect red darken-4 white-text waves-white btn-small'>
                    <i class='material-icons'>close</i></a>
                    </button>
                </div>
            </div>
        `;
        this._modalElement = M.Modal.init(this.querySelector('.modal'), {
            inDuration: 100,
            outDuration: 100
        });
    }
}

customElements.define('champion-info', ChampionInfoElement);