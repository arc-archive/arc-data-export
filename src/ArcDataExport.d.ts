/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/ArcDataExport.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {ExportProcessor} from './ExportProcessor.js';

export {ArcDataExport};

declare namespace LogicElements {

  /**
   * An element to handle data export for ARC.
   */
  class ArcDataExport extends HTMLElement {
    appVersion: String|null;
    electronCookies: Boolean|null;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;

    /**
     * Handler for the `export-data` custom event.
     * This event is not meant to be used to export ARC datstre data.
     */
    _exportHandler(e: CustomEvent|null): void;

    /**
     * Handler for `arc-data-export` event that exports ARC data
     * (settings, requests, project, etc).
     *
     * @param e Event dispatched by element requesting the export.
     */
    _arcExportHandler(e: CustomEvent|null): void;
    dataExport(opts: any): any;

    /**
     * Generates and saves ARC export object from user data.
     *
     * @param detail Export configuration. See
     * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/export-event.md
     * for details.
     * @returns Promise resolved to a result of saving a file.
     * Google Drive results with create response.
     */
    arcExport(detail: object|null): Promise<any>|null;

    /**
     * Creates an input data structure from datastore for further processing.
     *
     * @param data A map of datastores to export.
     * The key is the export name (defined in `export-panel`). The value is either
     * a boolean value which fetches all entries from the data store, or a list of
     * objects to export (no datastore query is made).
     */
    _getExportData(data: object|null): Promise<any>|null;

    /**
     * Maps export key from the event to database name.
     *
     * @param key Export data type name from the event.
     * @returns Database name
     */
    _getDatabaseName(key: String|null): String|null;

    /**
     * Maps export key from the event to export object proeprty name.
     *
     * @param key Export data type name from the event.
     * @returns Export property name.
     */
    _getExportKeyName(key: String|null): String|null;

    /**
     * Creates an export object for the data.
     *
     * @param data Export options. Available keys:
     * -   `requests` (Array) List of requests to export
     * -   `projects` (Array) List of projects to export
     * -   `history` (Array) List of history requests to export
     * -   `websocket-url-history` (Array) List of url history object for WS to export
     * -   `url-history` (Array) List of URL history objects to export
     * -   `variables` (Array) List of variables to export
     * -   `auth-data` (Array) List of the auth data objects to export
     * -   `cookies` (Array) List of cookies to export
     * -   `kind` (String) The `kind` property of the top export declaration.
     *      Default to `ARC#AllDataExport`
     * @param options Export configuration object
     * @returns ARC export object declaration.
     */
    createExportObject(data: object|null, options: object|null): object|null;

    /**
     * A function used with `electronCookies` flag.
     * It queries `electron-session-state` node module for cookies instead of
     * the database.
     */
    _queryCookies(): Promise<any>|null;

    /**
     * Disaptches `session-cookie-list-all` event and returns it.
     */
    _dispatchCookieList(): CustomEvent|null;

    /**
     * Returns all data from a database.
     *
     * @param dbName Name of the datastore t get the data from.
     * @returns Resolved promise to array of objects. It always
     * resolves.
     */
    _getDatabaseEntries(dbName: String|null): Promise<any>|null;

    /**
     * Fetches a single page of results from the database.
     *
     * @param db PouchDB instance
     * @param options Fetch options. This object is altered during fetch.
     * @returns Promise resolved to the list of documents.
     */
    _fetchEntriesPage(db: object|null, options: object|null): Promise<any>|null;

    /**
     * Requests application to export data to file.
     *
     * @param data Data to export
     * @param file File name
     * @param options Provider options
     */
    _exportFile(data: object|String|null, file: String|null, options: object|null): Promise<any>|null;

    /**
     * Requests application to export data to Google Drive.
     *
     * @param data Data to export
     * @param file File name
     * @param options Provider options
     */
    _exportDrive(data: object|String|null, file: String|null, options: object|null): Promise<any>|null;

    /**
     * Dispatches `encryption-encode` and await for the result.
     *
     * @param data Data to encode
     * @param passphrase Passphrase to use to encode the data
     * @returns Encoded data.
     */
    _encryptFile(data: String|null, passphrase: String|null): Promise<any>|null;
  }
}
