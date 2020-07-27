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

class TeamInformation extends HTMLElement {
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
        this.innerHTML = `
                    <table class='striped highlight' style='word-break: break-word;'>
                        <tr>
                            <td><b>Shortname</b></td>
                            <td>:</td>
                            <td>${this.valueOrStripped(this._data.shortName)}</td>
                        </tr>
                        <tr>
                            <td><b>TLA</b></td>
                            <td>:</td>
                            <td>${this.valueOrStripped(this._data.tla)}</td>
                        </tr>
                        <tr>
                            <td><b>Address</b></td>
                            <td>:</td>
                            <td>${this.valueOrStripped(this._data.address)}</td>
                        </tr>
                        <tr>
                            <td><b>Phone</b></td>
                            <td>:</td>
                            <td>${this.valueOrStripped(this._data.phone)}</td>
                        </tr>
                        <tr>
                            <td><b>Website</b></td>
                            <td>:</td>
                            <td>${this.valueOrStripped(this._data.website)}</td>
                        </tr>
                        <tr>
                            <td><b>Email</b></td>
                            <td>:</td>
                            <td>${this.valueOrStripped(this._data.email)}</td>
                        </tr>
                        <tr>
                            <td><b>Venue</b></td>
                            <td>:</td>
                            <td>${this.valueOrStripped(this._data.venue)}</td>
                        </tr>
                        <tr>
                            <td><b>Color</b></td>
                            <td>:</td>
                            <td>${this.valueOrStripped(this._data.color)}</td>
                        </tr>
                    </table>
        `;
    }

    valueOrStripped(dataValue){
        return dataValue ? dataValue : '-'
    }
}

customElements.define('team-info', TeamInformation);