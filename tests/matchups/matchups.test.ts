import EspnFantasyFootball from "./../../ts/EspnFantasyFootball";
import * as request from 'request';
import matchupsHTML from './MatchupsHtml';

var matchupsResult = require('./matchups.json');

const scraper = new EspnFantasyFootball({
    leagueId: 106980 //Test league I created for this purpose.
});

jest.mock('request');

test('Verify that matchups are correctly parsed', () => {
    request.mockImplementation(requestMock);

    scraper.getMatchups(null, (err, teams) => {
        expect(teams).toEqual(matchupsResult);
    });
  });

function requestMock(options: request.Options, callback: request.RequestCallback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, matchupsHTML);
}
