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
  * This module is intended to store all API Calls
  */

import {football_api, football_token} from './_apitoken';

const _compose = (postfx) => `${football_api}${postfx}`;
const apis = {
    competition_info : (league_id) => `/v2/competitions/${league_id}`,
    standings        : (league_id) => `${apis.competition_info(league_id)}/standings`,
    next_match       : (league_id, season) => `${apis.competition_info(league_id)}/matches?status=SCHEDULED&seasons=${season}`,
    past_match       : (league_id, season) => `${apis.competition_info(league_id)}/matches?status=FINISHED&seasons=${season}`,
    list_teams       : (league_id) => `${apis.competition_info(league_id)}/teams`,
    team             : (team_id) => `/v2/teams/${team_id}`
};

const fetchUrl= (api_methods) => fetch(_compose(api_methods), {
    headers: {
        'X-Auth-Token' : football_token
    }
});

export {apis, fetchUrl};