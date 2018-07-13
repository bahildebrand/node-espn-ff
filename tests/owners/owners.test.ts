import EspnFantasyFootball from "./../../ts/EspnFantasyFootball";
import * as request from 'request';
import ownersHTML from './OwnersHtml';

var ownersResult = require('./owners.json');

const scraper = new EspnFantasyFootball({
    leagueId: 106980 //Test league I created for this purpose.
});

// jest.mock('request');

test('Check that rosters are correctly parsed', () => {
    // request.mockImplementation(requestMock);

    scraper.getFantasyTeams((err, teams) => {
        // expect(teams).toEqual(ownersResult);
    });
  });

function requestMock(options: request.Options, callback: request.RequestCallback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, ownersHTML);
}
