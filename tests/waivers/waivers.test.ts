import EspnFantasyFootball from "./../../ts/EspnFantasyFootball";
import * as request from 'request';
import * as html from './WaiversHtml';
import * as results from './WaiverResults'
import * as init from './../init'

// var matchupsResult = require('./waivers.json');

// jest.mock('request');

test('Verify that waivers are correctly parsed', () => {
    // request.mockImplementation(requestMock);

    init.scraper.getWaivers(null, (err, players) => {
        expect(JSON.stringify(players)).toEqual(results.noFilterStr);
    });
  });

function requestMock(options: request.Options, callback: request.RequestCallback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, html.noFilterWaiverHTML);
}
