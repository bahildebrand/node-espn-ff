import * as requestMock from './../RequestMock'
import ownersHTML from './OwnersHtml';
import * as init from './../init'

var ownersResult = require('./owners.json');

// requestMock.initRequestMock();
// requestMock.setHTMLReturn(ownersHTML);

test('Check that rosters are correctly parsed', () => {
    init.scraper.getFantasyTeams((err, teams) => {
        expect(teams).toEqual(ownersResult);
    });
  });
