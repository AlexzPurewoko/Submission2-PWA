
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
  * This class is used to manage all fragments.
  * Like the Android mechanisms, using callback and overridden methods
  * to manage the lifecycle.
  * This Lifecycle is just simple, not as complex as Android does.
  */

import $ from 'jquery';

class NavigationUIController extends HTMLElement {
    constructor() {
        super();
        this._stacks = [];
        this._fragments = [];

        if(this === NavigationUIController){
            throw new ReferenceError('Please implement this class!');
        }

    }

    /* PUBLIC METHODS */
    init() {
        // DON'T OVERRIDE THIS METHOD
        this.innerHTML = `
            <style> 
                header, main {
                    padding-left: 300px;
                }

                @media only screen and (max-width: 992px){
                    header, main {
                        padding-left: 0;
                    }
                }
            </style>
            <header id='toolbar'>
                <nav-bar class='toolbar top-nav' data-target="toolbar" style="width: 100%;"></nav-bar>

            </header>
            <main style="margin: 20px 8px;">
                <!-- All fragment's item goes here -->
            </main>

            <aside>
                <side-nav></side-nav>
            </aside>
        `;

        // starts from first element
        this._createAndApply();
    }

    sendCommands(key, value){

    }

    /* PROTECTED METHODS AND PROPERTY */

    /**
     * Put all your fragment name element of fragment here
     */
    get fragments() {
        throw new Error('Property fragments doesnt have an implementation in its child class');
    }

    get sidenavContent() {
        throw new Error('Property sidenavContent doesnt have an implementation in its child class');
    }

    get databaseImpl() {
        throw new Error('Property databaseImpl doesnt have an implementation in its child class');
    }

    get sidenav() {
        return $('side-nav')[0];
    }

    get navbar() {
        return $('nav-bar')[0];
    }

    get container() {
        return $('main')[0];
    }

    // on sidenav ul element clicked
    // can be overrided
    onSideNavItemClicked(ids, element, event) {
        if(window.innerWidth < 992)
            element.toggleNav();
        return true;
    }

    async onFragmentChange(fragment){
        // TODO
        // overridden by its subclass (optional)
    }

    _createAndApply() {

        const mainElement = $(this.querySelector('main'));
        mainElement.empty();
        this._fragments = [];
        this.fragments.forEach(fragment => {
            const fg = $(`<${fragment}>`)[0];
            fg.sendCallbacks = (ev) => this.sendCommands(ev.key, ev.value);
            fg.dbOperation = this.databaseImpl;
            this._fragments.push(fg);
            mainElement.append(fg);
        });

        // initialize content sidenav
        this.sidenav.content = this.sidenavContent;
        this.sidenav.clickEvent = (ids, element, event) => this.onSideNavItemClicked(ids, element, event);
        this.sidenav.update();
    }

    _prepare(fragment) {
        // connecting all callbacks
        this.navbar.properties = {
            title : fragment.title,
            optionMenuEnabled: fragment.isOptionMenuEnabled,
            tabMenuEnabled: fragment.isTabEnabled,
            toggleType: fragment.toggleType
        };

        this.navbar.callbacks = {
            onCreateOptionsMenu: (menuElement) => fragment.onCreateOptionsMenu(menuElement),
            onCreateTabs: (tabElement) => fragment.onCreateTabs(tabElement),
            onToggleCallback: (toggleType) => this._onToggleCallback(toggleType)
        }
        this.navbar.update();
    }

    _getPositionByName(name) {
        const findedIdx = this.fragments.findIndex((item) => item === name);
        if(findedIdx < 0 || findedIdx >= this._fragments.length) return null;
        return this._fragments[findedIdx];
    }

    changeFragments(idFragment, argument) {
        const fragment = this._getPositionByName(idFragment);
        if(!this._fragments) return;
        const lastFg = this._getLastStacks();
        if(lastFg && lastFg.title === fragment.title) return;

        // call the save mode callback on the fragments
        if(this._getLastStacks())
        this._getLastStacks().onSaveState();

        // checks if this fragment is on 'back' mode
        if(fragment.toggleType !== 'back'){
            this._forceClearStacks();
        }
        this._pushStacks(fragment);
        
        fragment.arguments = argument;

        this._prepare(fragment);


        // call the render()
        fragment.onRenderPage();

        // hide all fragments
        this._hideAll();

        // update UI
        this._applyFragment(fragment);
       
    }


    /* PRIVATE METHOD */
    _pushStacks(fragment){
        this._stacks.push(fragment);
    }

    _popStacks(){
        return this._stacks.pop();
    }

    _getLastStacks(){
        return this._stacks === null ? null : this._stacks[this._stacks.length - 1];
    }

    _forceClearStacks() {
        this._stacks = [];
    }

    _hideAll() {
        this._fragments.forEach(fg => {
            $(fg).hide();
        });
    }

    _applyFragment(fragment){
        $(fragment).show();
        this.onFragmentChange(fragment);
    }

    // back button
    _onToggleCallback(toggleType){
        const lastFg = this._popStacks();
        const a = this._getLastStacks();
        $(lastFg).hide();
        this._prepare(a);
        a.onRenderPage();
        this._applyFragment(a);
    }

    
}

export default NavigationUIController;