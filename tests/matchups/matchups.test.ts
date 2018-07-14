import * as requestMock from './../RequestMock'
import matchupsHTML from './MatchupsHtml';
import * as init from './../init'

var matchupsResult = require('./matchups.json');

requestMock.initRequestMock();
requestMock.setHTMLReturn(matchupsHTML);

test('Verify that matchups are correctly parsed', () => {
    init.scraper.getMatchups(null, (err, teams) => {
        expect(teams).toEqual(matchupsResult);
    });
  });