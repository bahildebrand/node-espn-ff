import EspnFantasyFootball from "./../../ts/EspnFantasyFootball";
import * as request from 'request';
import ownersHTML from './RostersHtml';

var rostersResult = require('./rosters.json');

const scraper = new EspnFantasyFootball({
    leagueId: 106980 //Test league I created for this purpose.
});

// jest.mock('request');

test('Check that rosters are correctly parsed', () => {
    // request.mockImplementation(requestMock);

    scraper.getRoster(1, (err, teams) => {
        expect(teams).toEqual(rostersResult);
    });
  });

function requestMock(options: request.Options, callback: request.RequestCallback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, ownersHTML);
}
