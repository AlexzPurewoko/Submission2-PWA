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
class ClubListLeagueElement extends HTMLElement {
    constructor() {
        super();
        $.fn.animateRotate = function(angle, duration, easing, complete) {
            return this.each(function() {
                var $elem = $(this);

                $({deg: 0}).animate({deg: angle}, {
                duration: duration,
                easing: easing,
                step: function(now) {
                    $elem.css({
                    transform: 'rotate(' + now + 'deg)'
                    });
                },
                complete: complete || $.noop
                });
            });
        };
    }

    set data(d) {
        this._render(d);
    }

    _render(data) {

        let element = `
            <style>
                p {margin:0;}
                .collapsible-body > p {
                    margin:0 auto;
                }
                
            </style>
            <ul id='collapsible-league' class='collapsible'>
        `;

        data.forEach(item => {
            item.team.crestUrl = staticFunc.exportToHttps(item.team.crestUrl);
            element += `
                <li>
                    <div class="collapsible-header">
                        <div class='row' style='margin: 0 0;width:100%'>
                            <div class='col s3 xl2' >
                                <img class='clubEmblemImage' src='${item.team.crestUrl}' alt='Logo ${item.team.name}' style=""/>
                            </div>
                            <div class='col s7 xl8' style='height:100%'>
                                <div class='valign-wrapper' style='height:100%'>
                                    <h6 style="padding: 0;margin-top:auto;margin-bottom:auto;display:block;">${item.team.name}</h6>
                                </div>
                            </div>
                            <div class='col s2' style='height:100%'>
                                <div class='valign-wrapper' style='height:100%'>
                                <p class='center-align' style='margin:auto;display:block;'>
                                    <i id="collapse-toggle-dropdown" class="material-icons right-align" style="transform: rotate(180deg);">keyboard_arrow_up</i>
                                </p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="collapsible-body">
                        <div class='row' style='margin-bottom:0;'>
                            <div class='row'>
                                <div class='col s4 valign-wrapper'>
                                    <p class='center-align' style='margin:0 auto;'>Menang</p>
                                </div>
                                <div class='col s4 valign-wrapper'>
                                    <p class='center-align' style='margin:0 auto;'>Seri</p>
                                </div>
                                <div class='col s4 valign-wrapper'>
                                    <p class='center-align' style='margin:0 auto;'>Kalah</p>
                                </div>
                            </div>

                            <div class='row' >
                                <div class='col s4 valign-wrapper'>
                                    <p class='center-align' style='margin:0 auto;'>${item.won}x</p>
                                </div>
                                <div class='col s4 valign-wrapper'>
                                    <p class='center-align' style='margin:0 auto;'>${item.draw}x</p>
                                </div>
                                <div class='col s4 valign-wrapper'>
                                    <p class='center-align' style='margin:0 auto;'>${item.lost}x</p>
                                </div>
                            </div>
                        </div>
                    </div>              
                </li>
            `;
        });
        element += '</ul>';
        this.innerHTML = element;
        M.Collapsible.init($('#collapsible-league'), {
            onOpenStart: (e) => {
                const ils = e.querySelector('#collapse-toggle-dropdown');
                ils.innerText = 'keyboard_arrow_down';
                $(ils).animateRotate(180);
            },
            onCloseStart: (e) => {
                const ils = e.querySelector('#collapse-toggle-dropdown');
                ils.innerText = 'keyboard_arrow_up';
                $(ils).animateRotate(180);
            }
        });
    }
}

customElements.define('club-league-list', ClubListLeagueElement);