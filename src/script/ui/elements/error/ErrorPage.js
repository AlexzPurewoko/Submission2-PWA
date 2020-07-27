
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

class ErrorPage extends HTMLElement {
    constructor() {
        super();
        this._errorIcon = '/images/errors/warning-error.svg';
        this._message = "Error !";
        this._callback = _ => {};
    }
    static get observedAttributes() {
        return ['message'];
    }

    connectedCallback() {
        this._render();
    }

    _render(){
        this.innerHTML = `
            <div class='container'>
                <div class='row'>
                    <div class='col s12'>
                        <img src='${this._errorIcon}' style='width:50%;height:auto;display:block;margin: 0 auto;'>
                    </div>

                    <div class='col s12'>
                        <h5 class='center-align'>${this._message}</h5>
                    </div>
                </div>
            </div>
        `;
    }
    attributeChangedCallback(name, oldValue, newValue){
        if(oldValue != newValue){
            if(name === 'message'){
                this._message = newValue;
            }
            this._render();
        }
    }
}
customElements.define('error-page', ErrorPage);