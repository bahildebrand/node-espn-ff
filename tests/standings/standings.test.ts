import standingsHTML from './LeagueStandingsHtml';
import * as requestMock from './../RequestMock'
import * as init from './../init'

var standingsResult = require('./standings.json');

requestMock.initRequestMock();
requestMock.setHTMLReturn(standingsHTML);

test('Check that standings are correctly parsed', () => {

    init.scraper.getStandings((err, teams) => {
        expect(teams).toEqual(standingsResult);
    });
  });
