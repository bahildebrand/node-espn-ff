import EspnFantasyFootball from "./../../ts/EspnFantasyFootball";
import * as request from 'request';
import standingsHTML from './LeagueStandingsHtml';

var standingsResult = require('./standings.json');

const scraper = new EspnFantasyFootball({
    leagueId: 106980 //Test league I created for this purpose.
});

jest.mock('request');

test('Check that standings are correctly parsed', () => {
    request.mockImplementation(requestMock);

    scraper.getStandings((err, teams) => {
        expect(teams).toEqual(standingsResult);
    });
  });

function requestMock(options: request.Options, callback: request.RequestCallback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, standingsHTML);
}
