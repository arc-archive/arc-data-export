import { fixture, assert } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import 'chance/dist/chance.min.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import { DataHelper } from './data-helper.js';
import '../arc-data-export.js';
/* global Chance */
const chance = new Chance();

describe('<arc-data-export>', function() {
  async function basicFixture() {
    return (await fixture(`<arc-data-export></arc-data-export>`));
  }

  async function versionFixture() {
    return (await fixture(`<arc-data-export appversion="1.0.0-test"></arc-data-export>`));
  }

  async function electronCookiesFixture() {
    return (await fixture(`<arc-data-export electroncookies></arc-data-export>`));
  }

  function waitUntilFileEvent(done) {
    window.addEventListener('file-data-save', function f(e) {
      window.removeEventListener('file-data-save', f);
      done(e);
    });
  }
  function waitUntilDriveEvent(done) {
    window.addEventListener('google-drive-data-save', function f(e) {
      window.removeEventListener('google-drive-data-save', f);
      done(e);
    });
  }

  describe('Basic', function() {
    function mockRev(data) {
      return data.map((item) => {
        item._rev = chance.string();
        return item;
      });
    }

    let element;
    describe('_isAllowedExport()', function() {
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Passes test for equal string attributes', function() {
        const result = element._isAllowedExport('a', 'a');
        assert.isTrue(result);
      });

      it('Do not passes test for not equal string attributes', function() {
        const result = element._isAllowedExport('a', 'b');
        assert.isFalse(result);
      });

      it('Passes test if type is in array', function() {
        const result = element._isAllowedExport(['a', 'b', 'c'], 'a');
        assert.isTrue(result);
      });

      it('Do not passes test if type is not in array', function() {
        const result = element._isAllowedExport(['a', 'b', 'c'], 'd');
        assert.isFalse(result);
      });

      it('Passes test if exportType equals "all"', function() {
        const result = element._isAllowedExport('all');
        assert.isTrue(result);
      });
    });

    describe('_getDatabasesInfo()', function() {
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns empty object for not defined type', function() {
        const result = element._getDatabasesInfo();
        assert.lengthOf(Object.keys(result), 0);
      });

      it('Returns mapping for a single database', function() {
        const result = element._getDatabasesInfo('history');
        assert.typeOf(result['history-requests'], 'string');
        assert.lengthOf(Object.keys(result), 1);
      });

      it('Returns mapping for projects and saved requests', function() {
        const result = element._getDatabasesInfo('saved');
        assert.equal(result['saved-requests'], 'requests');
        assert.equal(result['legacy-projects'], 'projects');
        assert.lengthOf(Object.keys(result), 2);
      });

      it('Returns mapping for defined data types', function() {
        const types = [
          'history',
          'url-history',
          'websocket',
          'variables',
          'auth',
          'cookies',
          'host-rules'
        ];
        const result = element._getDatabasesInfo(types);
        assert.equal(result['history-requests'], 'history');
        assert.equal(result['websocket-url-history'], 'websocket-url-history');
        assert.equal(result['url-history'], 'url-history');
        assert.equal(result['auth-data'], 'auth-data');
        assert.equal(result['host-rules'], 'host-rules');
        assert.equal(result.variables, 'variables');
        assert.equal(result.cookies, 'cookies');
        assert.lengthOf(Object.keys(result), types.length);
      });
    });

    // describe('_prepareRequestsList()', function() {
    //   let data;
    //
    //   beforeEach(async () => {
    //     element = await basicFixture();
    //     const projects = DataGenerator.generateProjects({
    //       projectsSize: 20
    //     });
    //     data = DataGenerator.generateRequests({
    //       requestsSize: 20,
    //       projects: projects
    //     });
    //     data = mockRev(data);
    //   });
    //
    //   it('Result is an array', function() {
    //     const result = element._prepareRequestsList(data);
    //     assert.typeOf(result, 'array');
    //   });
    //
    //   it('_rev and _id is removed', function() {
    //     const result = element._prepareRequestsList(data);
    //     for (let i = 0, len = result.length; i < len; i++) {
    //       if (result[i]._id) {
    //         throw new Error('_id is set');
    //       }
    //       if (result[i]._rev) {
    //         throw new Error('_rev is set');
    //       }
    //     }
    //   });
    //
    //   it('key is set', function() {
    //     const result = element._prepareRequestsList(data);
    //     for (let i = 0, len = result.length; i < len; i++) {
    //       assert.typeOf(result[i].key, 'string');
    //     }
    //   });
    //
    //   it('legacyProject is removed', function() {
    //     data[0].legacyProject = 'abc';
    //     delete data[0].projects;
    //     const result = element._prepareRequestsList(data);
    //     assert.isUndefined(result[0].legacyProject);
    //   });
    //
    //   it('Creates projects from legacyProject', function() {
    //     data[0].legacyProject = 'abc';
    //     delete data[0].projects;
    //     const result = element._prepareRequestsList(data);
    //     assert.typeOf(result[0].projects, 'array');
    //     assert.equal(result[0].projects[0], 'abc');
    //   });
    //
    //   it('Adds to projects from legacyProject', function() {
    //     data[0].projects = ['test'];
    //     data[0].legacyProject = 'abc';
    //     const result = element._prepareRequestsList(data);
    //     assert.isUndefined(result[0].legacyProject);
    //     assert.lengthOf(result[0].projects, 2);
    //   });
    //
    //   it('kind property is set', function() {
    //     const result = element._prepareRequestsList(data);
    //     assert.equal(result[0].kind, 'ARC#RequestData');
    //   });
    // });
    //
    // describe('_prepareProjectsList()', function() {
    //   let data;
    //
    //   beforeEach(async () => {
    //     element = await basicFixture();
    //     data = DataGenerator.generateProjects({
    //       projectsSize: 5
    //     });
    //     data = mockRev(data);
    //   });
    //
    //   it('Result is an array', function() {
    //     const result = element._prepareProjectsList(data);
    //     assert.typeOf(result, 'array');
    //   });
    //
    //   it('_rev and _id is removed', function() {
    //     const result = element._prepareProjectsList(data);
    //     for (let i = 0, len = result.length; i < len; i++) {
    //       if (result[i]._id) {
    //         throw new Error('_id is set');
    //       }
    //       if (result[i]._rev) {
    //         throw new Error('_rev is set');
    //       }
    //     }
    //   });
    //
    //   it('key is set', function() {
    //     const ids = data.map((item) => item._id);
    //     const result = element._prepareProjectsList(data);
    //     for (let i = 0, len = result.length; i < len; i++) {
    //       if (result[i].key !== ids[i]) {
    //         throw new Error('Key is not set');
    //       }
    //     }
    //   });
    //
    //   it('kind property is set', function() {
    //     const result = element._prepareProjectsList(data);
    //     assert.equal(result[0].kind, 'ARC#ProjectData');
    //   });
    // });
    //
    // describe('_prepareHistoryDataList()', function() {
    //   let result;
    //
    //   beforeEach(async () => {
    //     element = await basicFixture();
    //     let data = DataGenerator.generateHistoryRequestsData();
    //     data = mockRev(data);
    //     result = element._prepareHistoryDataList(data);
    //   });
    //
    //   it('Result is an array', function() {
    //     assert.typeOf(result, 'array');
    //   });
    //
    //   it('_rev and _id is removed', function() {
    //     for (let i = 0, len = result.length; i < len; i++) {
    //       if (result[i]._id) {
    //         throw new Error('_id is set');
    //       }
    //       if (result[i]._rev) {
    //         throw new Error('_rev is set');
    //       }
    //     }
    //   });
    //
    //   it('kind property is set', function() {
    //     assert.equal(result[0].kind, 'ARC#HistoryData');
    //   });
    // });

    describe('createExportObject()', function() {
      describe('Base properties()', () => {
        const opts = {};

        beforeEach(async () => {
          element = await basicFixture();
        });

        it('Sets createdAt property', function() {
          const result = element.createExportObject(opts);
          assert.typeOf(result.createdAt, 'string');
        });

        it('Default version is set', function() {
          const result = element.createExportObject(opts);
          assert.equal(result.version, 'Unknown version');
        });

        it('Sets version from attribute', function() {
          element.appVersion = 'test-version';
          const result = element.createExportObject(opts);
          assert.equal(result.version, 'test-version');
        });

        it('Uses set version', async () => {
          element = await versionFixture();
          const result = element.createExportObject(opts);
          assert.equal(result.version, '1.0.0-test');
        });
      });

      [
        ['History', 'history', 'generateHistoryRequestsData', 'ARC#HistoryData'],
        ['Host rules', 'host-rules', 'generateHostRulesData', 'ARC#HostRule'],
        ['Variables', 'variables', 'generateVariablesData', 'ARC#Variable'],
        ['Websockets URL history', 'websocket-url-history', 'generateUrlsData', 'ARC#WebsocketHistoryData'],
        ['URL History', 'url-history', 'generateUrlsData', 'ARC#UrlHistoryData'],
        ['Auth', 'auth-data', 'generateBasicAuthData', 'ARC#AuthData'],
        ['Cookies', 'cookies', 'generateCookiesData', 'ARC#Cookie'],
        ['Projects', 'projects', 'generateProjects', 'ARC#ProjectData'],
        ['Requests basic', 'requests', 'generateRequests', 'ARC#RequestData']
      ].forEach((item) => {
        describe(`${item[0]} data`, () => {
          const property = item[1];
          const opts = {};
          beforeEach(async () => {
            element = await basicFixture();
            opts[property] = mockRev(DataGenerator[item[2]]());
          });

          it(`${property} is set`, function() {
            const result = element.createExportObject(opts);
            assert.typeOf(result[property], 'array');
            assert.lengthOf(result[property], opts[property].length);
            assert.isUndefined(result[property][0]._rew, 'Array was processed');
          });

          it('Result is an array', function() {
            const result = element.createExportObject(opts);
            assert.typeOf(result[property], 'array');
          });

          it('_rev and _id is removed, key is added', function() {
            const result = element.createExportObject(opts);
            const data = result[property];
            for (let i = 0, len = data.length; i < len; i++) {
              assert.isUndefined(data[i]._id);
              assert.isUndefined(data[i]._rev);
              assert.typeOf(data[i].key, 'string');
            }
          });

          it('kind property is set', function() {
            const result = element.createExportObject(opts);
            assert.equal(result[property][0].kind, item[3]);
          });
        });
      });

      describe('Requests and saved', () => {
        let opts;
        beforeEach(async () => {
          element = await basicFixture();
          opts = {};
        });

        it('Uses "saved" as requests', () => {
          opts.saved = mockRev(DataGenerator.generateRequests());
          const result = element.createExportObject(opts);
          assert.lengthOf(result.requests, opts.saved.length);
        });

        it('Combines saved and requests', () => {
          opts.saved = mockRev(DataGenerator.generateRequests());
          opts.requests = mockRev(DataGenerator.generateRequests());
          const result = element.createExportObject(opts);
          assert.lengthOf(result.requests, (opts.saved.length + opts.requests.length));
        });

        it('Creates "projects" from legacyProject', () => {
          opts.requests = mockRev(DataGenerator.generateRequests());
          opts.requests[0].legacyProject = 'test-project';
          opts.requests[0].projects = undefined;
          const result = element.createExportObject(opts);
          assert.lengthOf(result.requests[0].projects, 1);
          assert.isUndefined(result.requests[0].legacyProject);
        });

        it('Adds legacyProject to "projects"', () => {
          opts.requests = mockRev(DataGenerator.generateRequests());
          opts.requests[0].legacyProject = 'test-project';
          opts.requests[0].projects = ['test-other'];
          const result = element.createExportObject(opts);
          assert.deepEqual(result.requests[0].projects, ['test-other', 'test-project']);
          assert.isUndefined(result.requests[0].legacyProject);
        });
      });
    });

    describe('arcExport()', () => {
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Rejects when no "options"', () => {
        return element.arcExport({})
            .then(() => {
              throw new Error('Should not resolve');
            })
            .catch((cause) => {
              assert.typeOf(cause.message, 'string');
              assert.equal(cause.message, 'The "options" property is not set.');
            });
      });

      it('Rejects when no "options.provider"', () => {
        return element.arcExport({
          options: {}
        })
            .then(() => {
              throw new Error('Should not resolve');
            })
            .catch((cause) => {
              assert.typeOf(cause.message, 'string');
              assert.equal(cause.message, 'The "options.provider" property is not set.');
            });
      });

      it('Rejects when no "options.file"', () => {
        return element.arcExport({
          options: {
            provider: 'file'
          }
        })
            .then(() => {
              throw new Error('Should not resolve');
            })
            .catch((cause) => {
              assert.typeOf(cause.message, 'string');
              assert.equal(cause.message, 'The "options.file" property is not set.');
            });
      });
    });
  });

  describe('arcExport()', function() {
    const sampleSzie = 15;

    before(async () => {
      return DataHelper.generateData(sampleSzie);
    });

    after(function() {
      return DataGenerator.destroyAll();
    });

    const destination = 'file';

    describe('Generating data for a data type', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      [
        ['saved', 'saved', 'requests'],
        ['saved', 'saved', 'projects'],
        ['history', 'history', 'history'],
        ['websocket', 'websocket', 'websocket-url-history'],
        ['url history', 'url-history', 'url-history'],
        ['variables', 'variables', 'variables'],
        ['authorization', 'auth', 'auth-data'],
        ['cookies', 'cookies', 'cookies'],
        ['host rules', 'host-rules', 'host-rules']
      ].forEach((item) => {
        it(`Generates ${item[0]} data export`, function(done) {
          waitUntilFileEvent((e) => {
            e.preventDefault();
            const data = JSON.parse(e.detail.content);
            assert.typeOf(data[item[2]], 'array');
            assert.lengthOf(data[item[2]], 15);
            done();
          });
          const data = {};
          data[item[1]] = true;
          element.arcExport({
            options: {
              provider: destination,
              file: 'test-123',
            },
            data
          })
              .catch((cause) => {
                done(cause);
              });
        });
      });

      it('Uses passed requests object', function(done) {
        waitUntilFileEvent((e) => {
          e.preventDefault();
          const data = JSON.parse(e.detail.content);
          assert.typeOf(data.requests, 'array');
          assert.typeOf(data.projects, 'array');
          assert.lengthOf(data.requests, 5);
          assert.lengthOf(data.projects, 5);
          done();
        });
        const data = DataGenerator.generateSavedRequestData({
          projectsSize: 5,
          requestsSize: 5
        });
        element.arcExport({
          options: {
            provider: destination,
            file: 'test-123',
          },
          data
        });
      });

      it('Uses passed history object', function(done) {
        waitUntilFileEvent((e) => {
          e.preventDefault();
          const data = JSON.parse(e.detail.content);
          assert.typeOf(data.history, 'array');
          assert.lengthOf(data.history, 5);
          done();
        });
        element.arcExport({
          options: {
            provider: destination,
            file: 'test-123',
          },
          data: {
            history: DataGenerator.generateHistoryRequestsData({
              requestsSize: 5
            })
          }
        });
      });
    });
  });

  describe('dataExport()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _exportFile for file destination', () => {
      waitUntilFileEvent((e) => {
        e.preventDefault();
      });
      const spy = sinon.spy(element, '_exportFile');
      const result = element.dataExport({
        destination: 'file',
        data: {}
      });
      assert.isTrue(spy.called);
      return result;
    });

    it('Calls _exportDrive for file destination', () => {
      waitUntilDriveEvent((e) => {
        e.preventDefault();
      });
      const spy = sinon.spy(element, '_exportDrive');
      const result = element.dataExport({
        destination: 'drive',
        data: {}
      });
      assert.isTrue(spy.called);
      return result;
    });

    it('Rejects when destination is unknown', () => {
      return element.dataExport({
        data: {}
      })
          .then(() => {
            throw new Error('Should not resolve.');
          })
          .catch((cause) => {
            assert.notEqual(cause.message, 'Should not resolve.');
          });
    });

    it('Passes data property to export function', () => {
      waitUntilFileEvent((e) => {
        e.preventDefault();
      });
      const spy = sinon.spy(element, '_exportFile');
      const data = { test: true };
      const result = element.dataExport({
        destination: 'file',
        data
      });
      assert.deepEqual(spy.args[0][0], data);
      return result;
    });

    it('Uses default file name', () => {
      waitUntilFileEvent((e) => {
        e.preventDefault();
      });
      const spy = sinon.spy(element, '_exportFile');
      const result = element.dataExport({
        destination: 'file',
        data: {}
      });
      assert.deepEqual(spy.args[0][1], 'arc-data-export.json');
      return result;
    });

    it('Uses passed file name', () => {
      waitUntilFileEvent((e) => {
        e.preventDefault();
      });
      const spy = sinon.spy(element, '_exportFile');
      const result = element.dataExport({
        destination: 'file',
        file: 'test-file',
        data: {}
      });
      assert.deepEqual(spy.args[0][1], 'test-file');
      return result;
    });
  });

  describe('_dispatchCookieList()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Disaptches session-cookie-list-all event', () => {
      const spy = sinon.spy();
      element.addEventListener('session-cookie-list-all', spy);
      element._dispatchCookieList();
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const result = element._dispatchCookieList();
      assert.typeOf(result, 'customevent');
      assert.equal(result.type, 'session-cookie-list-all');
    });

    it('Event is cancelable', () => {
      const e = element._dispatchCookieList();
      assert.isTrue(e.cancelable);
    });

    it('Event is composed', () => {
      const e = element._dispatchCookieList();
      if (e.composed !== undefined) {
        assert.isTrue(e.composed);
      }
    });

    it('Event bubbles', () => {
      const e = element._dispatchCookieList();
      assert.isTrue(e.bubbles);
    });

    it('Event has detail', () => {
      const e = element._dispatchCookieList();
      assert.typeOf(e.detail, 'object');
    });
  });

  describe('_queryCookies()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function cookieFactory(e) {
      e.preventDefault();
      e.detail.result = Promise.resolve([{ name: 'a', domain: 'b', path: 'c' }]);
    }
    afterEach(() => {
      element.removeEventListener('session-cookie-list-all', cookieFactory);
    });

    it('Calls _dispatchCookieList()', () => {
      element.addEventListener('session-cookie-list-all', cookieFactory);
      const spy = sinon.spy(element, '_dispatchCookieList');
      element._queryCookies();
      assert.isTrue(spy.called);
    });

    it('Resolves to empty array when event not handled', () => {
      return element._queryCookies()
          .then((data) => {
            assert.equal(data.name, 'cookies');
            assert.typeOf(data.data, 'array');
            assert.lengthOf(data.data, 0);
          });
    });

    it('Resolves to cookie list in export data format', () => {
      element.addEventListener('session-cookie-list-all', cookieFactory);
      return element._queryCookies()
          .then((data) => {
            assert.equal(data.name, 'cookies');
            assert.typeOf(data.data, 'array');
            assert.lengthOf(data.data, 1);
          });
    });
  });

  describe('Querying for data', function() {
    const sampleSzie = 50;

    before(async function() {
      await DataHelper.generateData(sampleSzie);
    });

    after(async function() {
      await DataGenerator.destroyAll();
    });

    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Gets all requests data', async function() {
      const result = await element._getDatabaseEntries('saved-requests');
      assert.typeOf(result, 'object', 'result is an object');
      assert.equal(result.name, 'saved-requests', 'Name is set');
      assert.typeOf(result.data, 'array', 'Data is an array');
      assert.lengthOf(result.data, sampleSzie, 'Size is ok');
      assert.equal(result.data[0].type, 'saved', 'Is a saved request');
    });

    it('Gets all history data', async function() {
      const result = await element._getDatabaseEntries('history-requests');
      assert.typeOf(result, 'object', 'result is an object');
      assert.equal(result.name, 'history-requests', 'Name is set');
      assert.typeOf(result.data, 'array', 'Data is an array');
      assert.lengthOf(result.data, sampleSzie, 'Size is ok');
      assert.equal(result.data[0].type, 'history', 'Is a history request');
    });

    it('Gets all projects data', async function() {
      const result = await element._getDatabaseEntries('legacy-projects');
      assert.typeOf(result, 'object', 'result is an object');
      assert.equal(result.name, 'legacy-projects', 'Name is set');
      assert.typeOf(result.data, 'array', 'Data is an array');
      assert.lengthOf(result.data, sampleSzie, 'Size is ok');
      assert.typeOf(result.data[0].description, 'string', 'Is a project item');
    });

    it('Gets all websocket URL history data', async function() {
      const result = await element._getDatabaseEntries('websocket-url-history');
      assert.typeOf(result, 'object', 'result is an object');
      assert.equal(result.name, 'websocket-url-history', 'Name is set');
      assert.typeOf(result.data, 'array', 'Data is an array');
      assert.lengthOf(result.data, sampleSzie, 'Size is ok');
    });

    it('Gets all URL data', async function() {
      const result = await element._getDatabaseEntries('url-history');
      assert.typeOf(result, 'object', 'result is an object');
      assert.equal(result.name, 'url-history', 'Name is set');
      assert.typeOf(result.data, 'array', 'Data is an array');
      assert.lengthOf(result.data, sampleSzie, 'Size is ok');
    });

    it('Gets all variables data', async function() {
      const result = await element._getDatabaseEntries('variables');
      assert.typeOf(result, 'object', 'result is an object');
      assert.equal(result.name, 'variables', 'Name is set');
      assert.typeOf(result.data, 'array', 'Data is an array');
      assert.lengthOf(result.data, sampleSzie, 'Size is ok');
    });

    it('Gets all cookies data', async function() {
      const result = await element._getDatabaseEntries('cookies');
      assert.typeOf(result, 'object', 'result is an object');
      assert.equal(result.name, 'cookies', 'Name is set');
      assert.typeOf(result.data, 'array', 'Data is an array');
      assert.lengthOf(result.data, sampleSzie, 'Size is ok');
      assert.typeOf(result.data[0].domain, 'string', 'Is a cookie item');
    });

    it('Gets all auth-data data', async function() {
      const result = await element._getDatabaseEntries('auth-data');
      assert.typeOf(result, 'object', 'result is an object');
      assert.equal(result.name, 'auth-data', 'Name is set');
      assert.typeOf(result.data, 'array', 'Data is an array');
      assert.lengthOf(result.data, sampleSzie, 'Size is ok');
      assert.equal(result.data[0].type, 'basic', 'Is an auth data item');
    });
  });

  describe('Exporting ARC data - events API', function() {
    function fire(detail, type) {
      type = type || 'arc-data-export';
      const e = new CustomEvent(type, {
        detail,
        bubbles: true,
        composed: true,
        cancelable: true
      });
      document.body.dispatchEvent(e);
      return e;
    }

    function waitUntilFileEvent(done) {
      window.addEventListener('file-data-save', function f(e) {
        window.removeEventListener('file-data-save', f);
        done(e);
      });
    }

    function waitUntilDriveEvent(done) {
      window.addEventListener('google-drive-data-save', function f(e) {
        window.removeEventListener('google-drive-data-save', f);
        done(e);
      });
    }

    describe('arc-data-export', function() {
      const sampleSzie = 5;

      before(async function() {
        await DataHelper.generateData(sampleSzie);
      });

      after(async function() {
        await DataGenerator.destroyAll();
      });

      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Cancels the event', function() {
        waitUntilFileEvent((e) => {
          e.preventDefault();
        });
        const e = fire({
          options: {
            provider: 'file',
            file: 'file-123'
          },
          data: {
            saved: true,
          }
        });
        assert.isTrue(e.defaultPrevented);
        return e.detail.result;
      });

      it('Ignores cancelled events', function() {
        document.body.addEventListener('arc-data-export', function f(e) {
          document.body.removeEventListener('arc-data-export', f);
          e.preventDefault();
        });
        const e = fire({
          options: {
            provider: 'file',
            file: 'file-123'
          },
          destination: 'file',
          data: {
            saved: true,
          }
        });
        assert.isUndefined(e.detail.result);
      });

      it('Has a promise', function() {
        waitUntilFileEvent((e) => {
          e.preventDefault();
        });
        const e = fire({
          options: {
            provider: 'file',
            file: 'file-123'
          },
          data: {
            saved: true,
          }
        });
        assert.typeOf(e.detail.result.then, 'function');
        return e.detail.result;
      });

      it('Creates an export object with saved data', function(done) {
        waitUntilFileEvent((e) => {
          e.preventDefault();
          const data = JSON.parse(e.detail.content);
          assert.typeOf(data.requests, 'array');
          assert.lengthOf(data.requests, 5);
          done();
        });
        const e = fire({
          options: {
            provider: 'file',
            file: 'file-123'
          },
          data: {
            saved: true,
          }
        });
        e.detail.result
            .catch((cause) => done(cause));
      });

      it('Creates export object with existing data', function(done) {
        waitUntilFileEvent((e) => {
          e.preventDefault();
          const data = JSON.parse(e.detail.content);
          assert.typeOf(data.history, 'array');
          assert.lengthOf(data.history, 1);
          done();
        });
        const e = fire({
          options: {
            provider: 'file',
            file: 'arc-history-export.json',
            kind: 'ARC#HistoryExport'
          },
          data: {
            history: [{
              _id: 'test',
              url: 'https://domain.com',
              type: 'history',
              headers: 'x-a: b',
              method: 'GET'
            }]
          }
        });
        e.detail.result
            .catch((cause) => done(cause));
      });

      it('Exports data to Drive', function(done) {
        waitUntilDriveEvent((e) => {
          e.preventDefault();
          const data = JSON.parse(e.detail.content);
          assert.typeOf(data.requests, 'array');
          assert.lengthOf(data.requests, 5);
          assert.equal(e.detail.file, 'test-file');
          assert.equal(e.detail.options.contentType, 'application/restclient+data');
          done();
        });
        const e = fire({
          options: {
            provider: 'drive',
            file: 'test-file'
          },
          data: {
            saved: true,
          }
        });
        e.detail.result
            .catch((cause) => done(cause));
      });

      it('Calls dataExport() for export-data', function(done) {
        const spy = sinon.spy(element, 'dataExport');
        waitUntilFileEvent((e) => {
          e.preventDefault();
          assert.isTrue(spy.called);
          done();
        });

        fire({
          destination: 'file',
          file: 'test-file',
          data: {
            test: true
          }
        }, 'export-data');
      });
    });
  });

  describe('electronCookies property', () => {
    it('Has property from the attribute', async () => {
      const element = await electronCookiesFixture();
      assert.isTrue(element.electronCookies);
    });

    it('Property is set', async () => {
      const element = await basicFixture();
      element.electronCookies = true;
      assert.isTrue(element.electronCookies);
    });

    it('Property can be cleared', async () => {
      const element = await electronCookiesFixture();
      element.electronCookies = null;
      assert.isFalse(element.electronCookies);
    });

    it('Setting a property sets the attribute', async () => {
      const element = await basicFixture();
      element.electronCookies = true;
      assert.isTrue(element.hasAttribute('electroncookies'));
    });

    it('Clearing property removes the attribute', async () => {
      const element = await electronCookiesFixture();
      element.electronCookies = false;
      assert.isFalse(element.hasAttribute('electroncookies'));
    });
  });
});