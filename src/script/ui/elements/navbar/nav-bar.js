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
import M from 'materialize-css';
class NavBar extends HTMLElement {

    constructor() {
        super();

        this._properties = {
            title : 'Main',
            optionMenuEnabled: false,
            tabMenuEnabled: false,
            toggleType: 'menu' // ['menu' | 'back']
        };

        this._callbacks = {
            onCreateOptionsMenu: (menuElement) => {},
            onCreateTabs: (tabElement) => {},
            onToggleCallback: (toggleType) => {} // ['menu' | 'back']
        }
        this._currentTabElement = null;

    }

    connectedCallback() {
        this._render();
    }

    get properties() {
        return this._properties;
    }

    set properties(newProperties) {
        this._properties.title = newProperties.title;
        this._properties.optionMenuEnabled = newProperties.optionMenuEnabled;
        this._properties.tabMenuEnabled = newProperties.tabMenuEnabled;
        this._properties.toggleType = newProperties.toggleType;
    }

    set callbacks(newCallbacks) {
        this._callbacks.onCreateOptionsMenu = newCallbacks.onCreateOptionsMenu;
        this._callbacks.onCreateTabs = newCallbacks.onCreateTabs;
        this._callbacks.onToggleCallback = newCallbacks.onToggleCallback;
    }

    update(){
        this._render();
    }

    _render() {
        if(this._currentTabElement)
            this._currentTabElement.destroy();
        this.innerHTML = `
        <nav class="nav-extended grey darken-4">
            <div class="nav-wrapper">
                <a href="#!" class="brand-logo" id='brandNavbar' >${this.properties.title}</a>

                ${
                    (this.properties.toggleType === 'back') ? 
                    '<a href="#" id="back-arrow" class="show-on-medium-and-up sidenav-trigger waves-effect"><i class="material-icons">arrow_back</i></a>' :
                    '<a href="#" data-target="mobile-demo" class="sidenav-trigger waves-effect"><i class="material-icons">menu</i></a>'
                }

                ${
                    (this.properties.optionMenuEnabled) ?
                        `<ul id="option-menu" class="right"></ul>` : ''
                }
            </div>

            ${
                (this.properties.tabMenuEnabled) ?
                    `<div class="nav-content">
                        <ul id='tab-navbar' class="tabs tabs-transparent tabs-fixed-width">
                        </ul>
                    </div>` : ''
            }
        </nav>
        `;

        // calling all callbacks
        if(this.properties.optionMenuEnabled){
            this._callbacks.onCreateOptionsMenu(this.querySelector('#option-menu'));
        }

        if(this.properties.tabMenuEnabled){
            this._callbacks.onCreateTabs(this.querySelector('#tab-navbar'));
        }

        
        if(this.properties.toggleType === 'back'){
            $(window).on('resize', _ => {
                if(window.innerWidth > 992){
                    const width = $(this.querySelector('#back-arrow')).height();
                    $(this.querySelector('#brandNavbar')).css('margin-left', `${width}px`);
                } else {
                    $(this.querySelector('#brandNavbar')).css('margin-left', `0`);
                }
            });
            if(window.innerWidth > 992){
                const width = $(this.querySelector('#back-arrow')).height();
                $(this.querySelector('#brandNavbar')).css('margin-left', `${width}px`);
            }
            this.querySelector('#back-arrow').addEventListener('click', (e) => {
                this._callbacks.onToggleCallback(e);
            });
        }
        this._currentTabElement = M.Tabs.init(this.querySelector('.tabs'));
    }
}

customElements.define('nav-bar', NavBar);