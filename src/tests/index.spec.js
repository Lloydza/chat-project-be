const http = require('http');
const { expect } = require('chai');

const createServer = require('../index');

describe('index', () => {
  it('should create an instance of an HTTP server', () => {
    const server = createServer();
    expect(server).to.be.instanceof(http.Server);
  });
});
