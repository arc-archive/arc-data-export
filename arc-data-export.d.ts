/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   arc-data-export.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />

declare namespace LogicElements {

  /**
   * An element to handle data export for ARC.
   */
  class ArcDataExport extends Polymer.Element {

    /**
     * Hosting application version number. If not set it sends `app-version`
     * custom event to query for the application version number.
     */
    appVersion: string|null|undefined;

    /**
     * A size of datastore read operation in one call.
     */
    dbChunk: number|null|undefined;

    /**
     * If set it uses arc electron session state module to read cookie data
     */
    electronCookies: boolean|null|undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _exportHandler(e: any): void;
    dataExport(opts: any): any;

    /**
     * Generates and saves ARC export object from user data.
     *
     * @param opts Export options. See
     * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/export-event.md
     * for details.
     * @returns Promise resolved to a result of saving a file.
     * Google Drive results with create response.
     */
    arcExport(opts: object|null): Promise<any>|null;

    /**
     * Creates an export object for the data.
     *
     * @param opts Export options. Available keys:
     * -   `requests` (Array) List of requests to export
     * -   `projects` (Array) List of projects to export
     * -   `history` (Array) List of history requests to export
     * -   `websocket-url-history` (Array) List of url history object for WS to export
     * -   `url-history` (Array) List of URL history objects to export
     * -   `variables` (Array) List of variables to export
     * -   `headers-sets` (Array) List of the headers sets objects to export
     * -   `auth-data` (Array) List of the auth data objects to export
     * -   `cookies` (Array) List of cookies to export
     * -   `kind` (String) The `kind` property of the top export declaration.
     *      Default to `ARC#AllDataExport`
     * @returns ARC export object declaration.
     */
    createExportObject(opts: object|null): object|null;

    /**
     * A function used with `electronCookies` flag.
     * It queries `electron-session-state` node module for cookies instead of
     * the database.
     */
    _queryCookies(): Promise<any>|null;
    _prepareRequestsList(requests: any): any;
    _prepareProjectsList(projects: any): any;
    _prepareHistoryDataList(history: any): any;
    _prepareWsUrlHistoryData(history: any): any;
    _prepareUrlHistoryData(history: any): any;
    _prepareVariablesData(variables: any): any;
    _prepareHeadersSetsData(sets: any): any;
    _prepareAuthData(authData: any): any;
    _prepareCookieData(authData: any): any;
    _prepareHostRulesData(hostRules: any): any;

    /**
     * Checks if `type` is one of the allowed export types defined in
     * `exportType`.
     *
     * @param exportType Export type name or list of export types
     * names allowed to be exported.
     * @param type An export type to test
     * @returns True if the `type` is allowed
     */
    _isAllowedExport(exportType: String|any[]|null, type: String|null): Boolean|null;

    /**
     * Creats a map of database name <--> export object key name mapping.
     *
     * @param type Name of the database or list of databases names
     * to export
     * @returns A map where keys are database name and values are
     * export object properties where the data will be put.
     */
    _getDatabasesInfo(type: String|any[]|null): object|null;

    /**
     * Returns all data from a database.
     *
     * @param dbName Name of the datastore t get the data from.
     * @returns Resolved promise to array of objects. It always
     * resolves.
     */
    _getDatabaseEntries(dbName: String|null): Promise<any>|null;

    /**
     * Requests application to export data to file.
     *
     * @param data Data to export
     * @param file File name
     */
    _exportFile(data: object|String|null, file: String|null): Promise<any>|null;

    /**
     * Requests application to export data to Google Drive.
     *
     * @param data Data to export
     * @param file File name
     */
    _exportDrive(data: object|String|null, file: String|null): Promise<any>|null;
  }
}

interface HTMLElementTagNameMap {
  "arc-data-export": LogicElements.ArcDataExport;
}