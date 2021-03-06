const BaseUrl = 'http://games.espn.com/ffl';

import * as request from 'request';
import * as tc from 'tough-cookie';
import * as types from './types';
import { ParserService } from './parsers/ParserService';

/**
 *Constructor options for the EspnFantasyFootball class
 *
 * @export
 * @interface ConstructorOptions
 */
export interface ConstructorOptions {

    /**
     * Required. ESPN league id.
     *
     * @type {number}
     * @memberOf ConstructorOptions
     */
    leagueId: number;

    /**
     * Required. Cookies used to send requests.
     *
     * @type {string}
     * @memberOf ConstructorOptions
     */
    cookies: Cookies;
}

/**
 *Cookies needed to fetch pages that need login
 *
 * @export
 * @interface Cookies
 */
export interface Cookies {

    /**
     * Cookie needed for logged in pages. See README for how to obtain
     *
     * @type {string}
     * @memberOf Cookies
     */
    espnS2: string;

    /**
     * Cookie needed for logged in pages. See README for how to obtain
     *
     * @type {string}
     * @memberOf Cookies
     */
    SWID: string;
}

/**
 * Callback raised with fetch result from ESPN fantasy football.
 *
 * @export
 * @interface FetchParseCallback
 * @template T
 */
export interface FetchParseCallback<T> {
    (error?: Error, parseResult?: T);
}

/**
 * ESPN fantasy football root class
 *
 * @class EspnFantasyFootball
 */
export default class EspnFantasyFootball {

    private options: ConstructorOptions;
    private parserService: ParserService;


    /**
     * Creates an instance of EspnFantasyFootball.
     *
     * @param {ConstructorOptions} options
     *
     * @memberOf EspnFantasyFootball
     */
    constructor(options: ConstructorOptions) {
        this.options = options;
        this.parserService = new ParserService();
    }

    /**
     * Fetches all fantasy football teams within the fantasy league.
     *
     * @param {FetchParseCallback<types.IFantasyTeam[]>} callback
     * @returns {void}
     *
     * @memberOf EspnFantasyFootball
     */
    public getFantasyTeams(callback: FetchParseCallback<types.IFantasyTeam[]>) : void {
        return this.espnGetAndParse('owners', 'leaguesetup/ownerinfo', null, callback);
    }

    /**
     * Get current team standings in league.
     *
     * @param {FetchParseCallback<types.IFantasyTeam[]>} callback
     * @returns {void}
     *
     * @memberOf EspnFantasyFootball
     */
    public getStandings(callback: FetchParseCallback<types.IFantasyTeam[]>): void {
        let query: any = {};

        return this.espnGetAndParse('standings', 'standings', query, callback)
    }

    /**
     * Gets the top waiver players.
     *
     * @param {string} playerPos - Can be null for no position requested
     * @param {FetchParseCallback<types.IPlayer[]>} callback
     * @returns {void}
     *
     * @memberOf EspnFantasyFootball
     */
    public getWaivers(playerPos: string, callback: FetchParseCallback<types.IPlayer[]>): void {
        let query: any = {};

        if (playerPos) {
            if(playerPos == "QB") {
                query.slotCategoryId = 0;
            } else if(playerPos == "RB") {
                query.slotCategoryId = 2;
            } else if(playerPos == "WR") {
                query.slotCategoryId = 4;
            } else if(playerPos == "TE") {
                query.slotCategoryId = 6;
            } else if(playerPos == "FLEX") {
                query.slotCategoryId = 23;
            } else if(playerPos == "DST") {
                query.slotCategoryId = 16;
            } else if(playerPos == "K") {
                query.slotCategoryId = 17;
            }
        }

        return this.espnGetAndParse('waivers', 'freeagency', query, callback)
    }

    /**
     * Gets the active roster for the specified fantasy team.
     *
     * @param {number} teamId - Can be null for the default team identity
     * @param {FetchParseCallback<types.IRoster>} callback
     * @returns {void}
     *
     * @memberOf EspnFantasyFootball
     */
    public getRoster(teamId: number, callback: FetchParseCallback<types.IRoster>): void {
        let query: any = {};

        if (teamId) { query.teamId = teamId; }

        return this.espnGetAndParse('clubhouse', 'clubhouse', query, callback)
    }

    /**
     * Gets the fantasy matchups for the specified week within the league.
     *
     * @param {number} week - Week id (1 thru N), can be null for current week.
     * @param {FetchParseCallback<types.IFantasyMatchup[]>} callback
     * @returns {void}
     *
     * @memberOf EspnFantasyFootball
     */
    public getMatchups(week: number, callback: FetchParseCallback<types.IFantasyMatchup[]>) :void {
        let query: any = {};

        if (week) { query.matchupIdPeriod = week; }

        return this.espnGetAndParse('scoreboard', 'scoreboard', query, callback)
    }

    private espnGetAndParse<T>(parser: string, fragment: string | string[], urlQuery: any, callback: FetchParseCallback<T>) {
        return this.espnGetRequest(fragment, urlQuery, (err, response, body) => {
            if (err) return callback(err);

            if (response.statusCode != 200) {
                return callback(new Error(`Got unexpected status code '${response.statusCode}' from request`));
            }
            else if (!body) {
                return callback(new Error(`Got unexpected empty body from request`));
            }

            const result: T = this.parserService.parseHtmlContent(parser, body);

            if (!result) {
                return callback(new Error(`Parser '${parser}' returned empty result`));
            }

            return callback(null, result);
        });
    }

    private espnGetRequest(fragment: string | string[], urlQuery: any, callback: request.RequestCallback): void {
        fragment = Array.isArray(fragment) ? fragment.join('/') : fragment;
        urlQuery = urlQuery || {};
        urlQuery.leagueId = this.options.leagueId;

        const espnS2 = new tc.Cookie({
            key    : 'espn_s2',
            value  : this.options.cookies.espnS2,
            domain : 'espn.com'
          });
          const SWID = new tc.Cookie({
            key    : 'SWID',
            value  : this.options.cookies.SWID,
            domain : 'espn.com'
        });

        let cJar: request.CookieJar = request.jar();

        // console.log(cJar);

        cJar.setCookie(espnS2, 'http://games.espn.com/');
        cJar.setCookie(SWID, 'http://games.espn.com/');

        const rOptions: request.Options = {
            method: 'GET',
            url: BaseUrl + '/' + fragment,
            qs: urlQuery,
            jar: cJar,
            headers: {
                'Accept': 'text/html',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36'
            }
        };

        request(rOptions, callback);
    }
}
