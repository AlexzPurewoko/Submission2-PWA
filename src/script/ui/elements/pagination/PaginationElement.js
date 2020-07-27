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

class PaginationElement extends HTMLElement {
    constructor(){
        super();
        this._count = 1;
        this._maxVisibled = 5;
        this._offsetStart = 1;
        this._offsetEnd = 1;
        this._activeNumber = 1;
        this._onClicked = (num) =>{};
    }

    set count(numCount){
        this._count = numCount;
        this._activeNumber = 1;
        if(numCount >= this._maxVisibled){
            this._offsetEnd = this._maxVisibled;
        } else {
            this._offsetEnd = numCount;
        }
    }

    set onClick(clicked){
        this._onClicked = (num) => clicked(num);
    }

    update() {
        this._render();
    }

    _render(){

        let liElements = '';
        const enablePrev = this._offsetStart > 1;
        const enableNext = this._offsetEnd < this._count;
        for(let x = this._offsetStart; x <= this._offsetEnd; x++){
            liElements += `
                <li class="waves-effect${x===this._activeNumber?' active': ''}"><a href="#!">${x}</a></li>
            `;
        }
        this.innerHTML = `
            <div style='width:100%'>
                <ul class='pagination center-align'>
                    <li class='${enablePrev? "waves-effect" : "disabled"}'><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                    ${liElements}
                    <li class="${enableNext? "waves-effect" : "disabled"}"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
                </ul>
            </div>
        `;

        // implement previous click
        this.querySelector('.pagination').addEventListener('click', (event) => {
            const target = event.target;
            if(target.innerText === 'chevron_left' ){
                if($(target).parent().parent().hasClass('disabled')) return;
                let a = this._offsetStart - this._maxVisibled;
                a = a < 1 ? 1 : a;
                this._offsetStart = a;
                this._offsetEnd = this._offsetStart + this._maxVisibled - 1;
                this._render();
            } else if(target.innerText === 'chevron_right'){
                if($(target).parent().parent().hasClass('disabled')) return;
                let a = this._offsetEnd + this._maxVisibled;
                a = a > this._count ? this._count : a;
                this._offsetEnd = a;
                this._offsetStart = this._offsetEnd - this._maxVisibled + 1;
                this._render();
            } else {
                const newNumber = parseInt(target.innerText);
                if(this._activeNumber !== newNumber){
                    this._activeNumber = newNumber;
                    this._render();
                    this._onClicked(newNumber);
                }
            }
        })
    }
}

customElements.define('pagination-element', PaginationElement);
