import EspnFantasyFootball from "./../../ts/EspnFantasyFootball";
import * as request from 'request';
import * as html from './WaiversHtml';
import * as results from './WaiverResults'

// var matchupsResult = require('./waivers.json');

const scraper = new EspnFantasyFootball({
    leagueId: 106980 //Test league I created for this purpose.
});

jest.mock('request');

test('Verify that waivers are correctly parsed', () => {
    request.mockImplementation(requestMock);

    scraper.getWaivers(null, (err, players) => {
        expect(JSON.stringify(players)).toEqual(results.noFilterStr);
    });
  });

function requestMock(options: request.Options, callback: request.RequestCallback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, html.noFilterWaiverHTML);
}
