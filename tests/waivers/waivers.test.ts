import * as html from './WaiversHtml';
import * as init from './../init'
import * as requestMock from './../RequestMock'

var waiverResults = require('./waivers.json')

requestMock.initRequestMock();
requestMock.setHTMLReturn(html);

test('Verify that waivers are correctly parsed', () => {
    init.scraper.getWaivers(null, (err, players) => {
        expect(players).toEqual(waiverResults);
    });
  });
