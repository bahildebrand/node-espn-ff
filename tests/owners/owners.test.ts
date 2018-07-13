import EspnFantasyFootball from "./../../ts/EspnFantasyFootball";
import * as request from 'request';
import ownersHTML from './OwnersHtml';
import * as init from './../init'

var ownersResult = require('./owners.json');

// jest.mock('request');

test('Check that rosters are correctly parsed', () => {
    // request.mockImplementation(requestMock);

    init.scraper.getFantasyTeams((err, teams) => {
        expect(teams).toEqual(ownersResult);
    });
  });

function requestMock(options: request.Options, callback: request.RequestCallback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, ownersHTML);
}
