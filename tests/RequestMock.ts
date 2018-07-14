var request = require('request');
var requestActual = require.requireActual('request');

var cookieJar = requestActual.jar();
var htmlReturn;

jest.mock('request');

export function setHTMLReturn(retVal) {
    htmlReturn = retVal;
}

export function initRequestMock() {
    request.mockImplementation(requestMock);
    request.jar.mockImplementation(jarMock);
}

function jarMock() {
    return cookieJar;
}

function requestMock(options, callback ) {
    let response = {
        statusCode: 200
    }

    callback(null, response, htmlReturn);
}