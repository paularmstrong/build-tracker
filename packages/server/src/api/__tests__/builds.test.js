// @flow
// eslint-env jest

import * as Builds from '../builds';
import MockRequest from 'mock-express-request';
import MockResponse from 'mock-express-response';

const builds = [
  { meta: { revision: '123456', timestamp: 123456, branch: 'master' }, artifacts: {} },
  {
    meta: { revision: { value: '789012', url: 'https://example.com' }, timestamp: 789012, branch: 'master' },
    artifacts: {}
  }
];

describe('API Builds', () => {
  describe('handleGet', () => {
    let getByRevisions, getBuilds, handleGet;
    beforeEach(() => {
      getByRevisions = jest.fn(() => Promise.resolve([]));
      getBuilds = jest.fn(() => Promise.resolve([]));
      handleGet = Builds.handleGet({ getByRevisions, getBuilds });
    });

    test('queries for specific revisions', done => {
      const request = new MockRequest({ method: 'GET', query: { revisions: ['123456', '789012'] } });
      const response = new MockResponse();
      const responseBody = Promise.resolve(builds);
      getByRevisions.mockReturnValue(responseBody);

      response.write = data => {
        expect(getByRevisions).toHaveBeenCalledWith(['123456', '789012']);
        expect(data).toEqual(JSON.stringify(builds));
        done();
      };
      handleGet(request, response);
    });

    test('queries for builds filtered by date', done => {
      const query = { startTime: 100000, endTime: 800000 };
      const request = new MockRequest({ method: 'GET', query });
      const response = new MockResponse();
      const responseBody = Promise.resolve(builds);
      getBuilds.mockReturnValue(responseBody);

      response.write = data => {
        expect(getBuilds).toHaveBeenCalledWith(query);
        expect(data).toEqual(JSON.stringify(builds));
        done();
      };
      handleGet(request, response);
    });

    test('queries for builds filtered by branch', done => {
      const query = { branch: 'foobar' };
      const request = new MockRequest({ method: 'GET', query });
      const response = new MockResponse();
      const responseBody = Promise.resolve(builds);
      getBuilds.mockReturnValue(responseBody);

      response.write = data => {
        expect(getBuilds).toHaveBeenCalledWith(query);
        expect(data).toEqual(JSON.stringify(builds));
        done();
      };
      handleGet(request, response);
    });

    test('queries for builds with a full query', done => {
      const query = { branch: 'foobar', limit: 4, startTime: 123, endTime: 800000 };
      const request = new MockRequest({ method: 'GET', query });
      const response = new MockResponse();
      const responseBody = Promise.resolve(builds);
      getBuilds.mockReturnValue(responseBody);

      response.write = data => {
        expect(getBuilds).toHaveBeenCalledWith(query);
        expect(data).toEqual(JSON.stringify(builds));
        done();
      };
      handleGet(request, response);
    });
  });

  describe('handlePost', () => {
    let getPrevious, insert, handlePost, onBuildInserted;
    beforeEach(() => {
      getPrevious = jest.fn(() => Promise.resolve(builds[1]));
      insert = jest.fn(() => Promise.resolve(builds[1]));
      onBuildInserted = jest.fn();
      handlePost = Builds.handlePost({ getPrevious, insert }, { onBuildInserted });
    });

    test('inserts a build', done => {
      const request = new MockRequest({ method: 'POST', body: builds[1] });
      const response = new MockResponse();
      response.write = function(data) {
        expect(data).toEqual(JSON.stringify({ success: true }));
        expect(response.statusCode).toEqual(200);
        done();
      };
      handlePost(request, response);
    });

    test('calls onBuildInserted callback', done => {
      const request = new MockRequest({ method: 'POST', body: builds[1] });
      const response = new MockResponse();
      getPrevious.mockReturnValue(Promise.resolve(builds[0]));
      response.end = () => {
        expect(onBuildInserted).toHaveBeenCalled();
        done();
      };
      handlePost(request, response);
    });

    describe('returns an error when', () => {
      Object.entries({
        'missing meta': { artifacts: {} },
        'missing revision': { meta: { timestamp: 123 }, artifacts: {} },
        'revision is not a string': { meta: { revision: 4, timestamp: 123 }, artifacts: {} },
        'missing timestamp': { meta: { revision: '123' }, artifacts: {} },
        'timestamp is not a number': { meta: { revision: '123', timestamp: 'tacos' }, artifacts: {} },
        'missing artifacts': { meta: { timestamp: 123, revision: '123' } }
      }).forEach(([title, body]) => {
        test(`${title}`, done => {
          const request = new MockRequest({ method: 'POST', body });
          const response = new MockResponse();
          response.write = data => {
            expect(response.statusCode).toEqual(400);
            expect(JSON.parse(data).success).toBe(false);
            done();
          };
          handlePost(request, response);
        });
      });
    });
  });
});
