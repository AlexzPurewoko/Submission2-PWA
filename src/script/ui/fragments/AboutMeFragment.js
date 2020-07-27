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

import FragmentUIHolder from '../base/FragmentUIHolder';

class AboutMeFragment extends FragmentUIHolder {
    constructor() {
        super();
    }

    get title() {
        return 'AboutMe';
    }

    onRenderPage(){
        this.innerHTML = `
            <div class="container">
                <div class="card">
                    <div class="card-content">
                        <div class="row">
                            <div class="col s12 m4 l4 xl4 valign-wrapper">
                                <img class="responsive-img valign-wrapper" src="/images/others/nav-icon.png" alt='icon-football-app' width="650">
                            </div>
                            <div class="col s12 m8 l8 xl8">
                                <span class="card-title text-bold" style="font-weight:bold;margin-top:10px;">Football Apps</span>
                                <p style="font-weight: 400;">Created by Alexzander Purwoko Widiantoro</p>
                                <p style="margin-top: 10px;">Lets know all of football matchs and teams, discover mode! Take a look and enjoy! Hopefully you love my articles. Thank you :).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    onSaveState() {

    }
}

customElements.define('fragment-aboutme', AboutMeFragment);
