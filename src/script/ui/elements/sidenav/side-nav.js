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

import M from 'materialize-css';
import $ from 'jquery';

class SideNav extends HTMLElement {
    constructor() {
        super();

        this._background = '/images/others/nav-header.jpg' // SET HERE
        this._profile = '/images/others/nav-icon.png' // SET HERE

        this._clickEvent = (id_element, element, event) => false;

        this._content = null;
        this._sidenavElement = null;
    }

    toggleNav() {
        if(!this._sidenavElement) return;
        const sidenav = this._sidenavElement;
        if(sidenav.isOpen){
            sidenav.close();
        } else {
            sidenav.open();
        }
    }

    /**
     * fill with -> nContent = [
     *      [id, elementHtml]
     * ]
     */
    set content(nContent) {
        this._content = nContent;
    }

    set clickEvent(newEvent) {
        this._clickEvent = newEvent;
    }

    selectNav(position){
        if(!(this._content !== null && position > -1 && position < this._content.length)) return;
        for(let x = 0; x < this._content.length; x++){
            const selectedIds = $(`#${this._content[x][0]}`).parent();
            if(x===position && !selectedIds.hasClass('active')){
                selectedIds.addClass('active');
            } else {
                selectedIds.removeClass('active');
            }
        }
    }

    update(){
        this._render();
    }

    _render() {
        if(!this._content)return;
        if(this._sidenavElement)
            this._sidenavElement.destroy();
        let displayContent = `

        <style>
        .sidenav li.active {
            background-color: rgba(0,0,0,0.3);
        }
        </style>
        <ul id="mobile-demo" class="sidenav sidenav-fixed grey darken-4 white-text" >
            <li>
                <div class="user-view">
                    <div class="background">
                        <img src="${this._background}" alt='playing football'>
                    </div>
                    <a href="#user"><img style='max-width:64px;max-height:auto;' src="${this._profile}" alt='icon'></a>
                    <a href="#name"><span class="white-text name" style="font-weight: bold;font-family: sans-serif;">Football Apps</span></a>
                    <a href="#email"><span class="white-text email" style="font-family: sans-serif;">UEFA League Championship</span></a>
                </div>
            </li>
        `;
        
        this._content.forEach(cnt => {
            displayContent += 
                `<li>
                    <a id='${cnt[0]}' 
                        class="waves-effect white-text" href="#!" 
                        style="font-weight: bold;"
                    >${cnt[1]}</a>
                </li>`;
        });

        displayContent += '</ul>';

        this.innerHTML = displayContent;

        this._sidenavElement = M.Sidenav.init(this.querySelector('.sidenav'));

        // apply the callbacks
        this._content.forEach(cnt => {
            this.querySelector(`#${cnt[0]}`).addEventListener('click', (e) => {
                // if its same, prevent from clicking again
                if($(e.target).parent().hasClass('active')) return;
                if(this._clickEvent(cnt[0], this, e)){
                    // clear each active class
                    $(e.target).parent().parent().children().each((index, element) => {
                        $(element).removeClass('active');
                    });
                    
                    // set new active class
                    $(e.target).parent().addClass('active');
                }
            })
        });



    }
}
customElements.define('side-nav', SideNav);