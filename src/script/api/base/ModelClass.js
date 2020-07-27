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
  * This module is an abstract class.
  * Provided to all module that implements
  * Call API method
  */
import {fetchUrl} from  '../base/api_methods';

class ModelClass {
    constructor() {

        // Signature of callbacks
        this._callbacks = {

            /**
             * the structure of data must be 
             * data -> {
             *     status: [ModelClass.STATUS_FAILED | ModelClass.STATUS_SUCCESS]
             *     message: [string]
             *     data: [The object data that will be implemented by its subclass]
             * }
             */
            onFinished: (data) => {},
            
            // On Load data
            onLoad: () => {}
        }
        if(this === ModelClass){
            throw new ReferenceError('Please implement this class!');
        }
    }

    // TO BE IMPLEMENTED BY ITS SUBCLASS
    get apiMethod() {
        throw new ReferenceError("apiMethod() not implemented");
    }

    async _serveData(jsonData) {
        throw new ReferenceError("serveData() not implemented");
    }

    // PRIVATE METHODS
    _composeData(statusLoad, msg, retData){
        return {
            status: statusLoad,
            message: msg,
            data: retData
        }
    }

    /**
     *  PUBLIC METHODS AND PROPERTY
     */
    async startLoad(){
        try {
            this._callbacks.onLoad()
            const response = await fetchUrl(this.apiMethod);
            const json = await response.json();
            const servedData = await this._serveData(json);
            this._callbacks.onFinished(this._composeData(
                ModelClass.STATUS_SUCCESS,
                "Success When retrieving data from APIS",
                servedData
            ));
        } catch (error) {
            this._callbacks.onFinished(this._composeData(
                ModelClass.STATUS_FAILED,
                "Error when retrieving data",
                error
            ));
        }
    }

    set callbacks(newCallbacks) {
        this._callbacks.onFinished = newCallbacks.onFinished;
        this._callbacks.onLoad = newCallbacks.onLoad;
    } 

    static get STATUS_SUCCESS() {
        return "SUCCESS";
    }

    static get STATUS_FAILED() {
        return "FAILED";
    }
}

export default ModelClass;