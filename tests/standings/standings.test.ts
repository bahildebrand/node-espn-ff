import EspnFantasyFootball from "./../../ts/EspnFantasyFootball";
import * as request from 'request';
import standingsHTML from './LeagueStandingsHtml';
import * as init from './../init'

var standingsResult = require('./standings.json');

// jest.mock('request');

test('Check that standings are correctly parsed', () => {
    // request.mockImplementation(requestMock);

    init.scraper.getStandings((err, teams) => {
        expect(teams).toEqual(standingsResult);
    });
  });

function requestMock(options: request.Options, callback: request.RequestCallback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, standingsHTML);
}
