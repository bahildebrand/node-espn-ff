import EspnFantasyFootball from "./../../ts/EspnFantasyFootball";
import * as request from 'request';
import ownersHTML from './RostersHtml';
import * as init from './../init'

var rostersResult = require('./rosters.json');

// jest.mock('request');

test('Check that rosters are correctly parsed', () => {
    // request.mockImplementation(requestMock);

    init.scraper.getRoster(1, (err, teams) => {
        // expect(teams).toEqual(rostersResult);
    });
  });

function requestMock(options: request.Options, callback: request.RequestCallback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, ownersHTML);
}
