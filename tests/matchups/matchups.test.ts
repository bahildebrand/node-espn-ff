import EspnFantasyFootball from "./../../ts/EspnFantasyFootball";
import * as request from 'request';
import matchupsHTML from './MatchupsHtml';
import * as init from './../init'

var matchupsResult = require('./matchups.json');

// jest.mock('request');

test('Verify that matchups are correctly parsed', () => {
    // request.mockImplementation(requestMock);

    init.scraper.getMatchups(null, (err, teams) => {
        expect(teams).toEqual(matchupsResult);
    });
  });

function requestMock(options: request.Options, callback: request.RequestCallback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, matchupsHTML);
}
