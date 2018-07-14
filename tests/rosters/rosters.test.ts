import rostersHTML from './RostersHtml';
import * as requestMock from './../RequestMock'
import * as init from './../init'

var rostersResult = require('./rosters.json');

requestMock.initRequestMock();
requestMock.setHTMLReturn(rostersHTML);

test('Check that rosters are correctly parsed', () => {
    init.scraper.getRoster(1, (err, teams) => {
        // expect(teams).toEqual(rostersResult);
    });
  });
