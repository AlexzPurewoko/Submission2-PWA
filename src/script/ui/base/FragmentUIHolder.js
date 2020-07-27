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
  * Because using SPA mechanisms
  * Then the UI will be managed with fragment principe
  * So, all UI Fragments must extends this class
  */

class FragmentUIHolder extends HTMLElement {
    constructor() {
        super();
        this._arguments = null;
        this._sendCallbacks = null;
        this._dbOperation = null;
        if(this === FragmentUIHolder){
            throw new TypeError('Please implement this class!');
        }
    }

    get title() {
        throw new Error('You must define the title of pages');
    }

    get toggleType() {
        return 'menu'; // can be overrided and set for your page with ['menu' | 'back']
    }

    get isOptionMenuEnabled() {
        return false; // can be overrided and set for your page with ['true' | 'false']
    }

    get isTabEnabled() {
        return false; // can be overrided and set for your page with ['true' | 'false']
    }

    get dbOperation() {
        return this._dbOperation;
    }

    get arguments() {
        return this._arguments;
    }

    set arguments(data) {
        this._arguments = data;
    }

    set sendCallbacks(eventCallbacks){
        this._sendCallbacks = eventCallbacks;
    }

    set dbOperation(db) {
        this._dbOperation = db;
    }

    onCreateOptionsMenu(menuElement){
        return false; // if isOptionMenuEnabled is enabled. then you must override it and return to true if have done
    }
    
    onRenderPage() {
        throw new Error('Please implement onRenderPage() method!');
    }

    onSaveState() {
        throw new Error('Please implement onSaveState() method!');
    }

    onCreateTabs(tabElement) {
        return false; // if isTabEnabled is enabled. then you must override it and return to true if have done
    }

    // request change fragments UI
    sendCommands(keyA, valueA){
        if(this._sendCallbacks)
            this._sendCallbacks({
                key: keyA,
                value: valueA
            });
    }

}

export default FragmentUIHolder;