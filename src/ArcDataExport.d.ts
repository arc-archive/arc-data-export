import { DataExport, Cookies } from '@advanced-rest-client/arc-types';
import { ArcExportEvent, ArcDataExportEvent } from '@advanced-rest-client/arc-events';

export const appVersionValue: unique symbol;
export const electronCookiesValue: unique symbol;
export const exportHandler: unique symbol;
export const nativeExportHandler: unique symbol;
export const exportFile: unique symbol;
export const exportDrive: unique symbol;
export const queryCookies: unique symbol;
export const encryptData: unique symbol;
export const getClientCertificatesEntries: unique symbol;
export const prepareExportData: unique symbol;

/**
 * Maps export key from the event to database name.
 * @param key Export data type name from the event.
 * @returns Database name
 */
declare function getDatabaseName(key: keyof DataExport.ArcNativeDataExport): string;

/**
 * An element to handle data export for ARC.
 */
export declare class ArcDataExport extends HTMLElement {
  [appVersionValue]?: string;
  [electronCookiesValue]?: boolean;

  static readonly observedAttributes: string[];
  /**
   * Hosting application version number. If not set it sends `app-version`
   * custom event to query for the application version number.
   */
  appVersion?: string;
  /**
   * If set it uses arc electron session state module to read cookie data
   */
  electronCookies?: boolean;
  /**
   * The size of datastore read operation in a signle fetch.
   */
  dbChunk: number;

  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;

  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;

  /**
   * Exports any data with any of the export providers.
   * @param data The data to export
   * @param exportOptions Export options
   * @param providerOptions Options passed to the export provider
   * @returns Promise resolved to a result of saving a file.
   */
  dataExport(data: any, exportOptions: DataExport.ExportOptions, providerOptions: DataExport.ProviderOptions): Promise<DataExport.ArcExportResult>;

  /**
   * Generates and saves ARC export object from user data.
   * @param data The data to export
   * @param exportOptions Export options
   * @param providerOptions Options passed to the export provider
   * @returns Promise resolved to a result of saving a file.
   */
  arcExport(data: DataExport.ArcNativeDataExport, exportOptions: DataExport.ExportOptions, providerOptions: DataExport.ProviderOptions): Promise<DataExport.ArcExportResult>;

  /**
   * Creates an input data structure from datastore for further processing.
   * @param data A map of datastores to export.
   */
  getExportData(data: DataExport.ArcNativeDataExport): Promise<DataExport.ArcExportProcessedData[]>;

  /**
   * Creates an export object for the data.
   *
   * @param data
   * @param options Export configuration object
   * @returns ARC export object declaration.
   */
  createExportObject(data: DataExport.ArcExportProcessedData[], options: DataExport.ExportOptions): DataExport.ArcExportObject;

  [exportHandler](e: ArcExportEvent): void;

  /**
   * Handler for `arc-data-export` event that exports ARC data
   * (settings, requests, project, etc).
   * @param e Event dispatched by element requesting the export.
   */
  [nativeExportHandler](e: ArcDataExportEvent): void;

  [prepareExportData](key: keyof DataExport.ArcNativeDataExport, data: DataExport.ArcNativeDataExport): Promise<DataExport.ArcExportProcessedData>;

  /**
   * Disaptches cookie list event and returns  the result
   */
  [queryCookies](): Promise<Cookies.ARCCookie[]>;

  [getClientCertificatesEntries](): Promise<DataExport.ArcExportClientCertificateData[]|undefined>;

  /**
   * Requests application to export data to file.
   *
   * @param data The data to export
   * @param options Provider options
   */
  [exportFile](data: any, options: DataExport.ProviderOptions): Promise<DataExport.ArcExportResult>;

  /**
   * Requests application to export data to Google Drive.
   *
   * @param data The data to export
   * @param options Provider options
   */
  [exportDrive](data: any, options: DataExport.ProviderOptions): Promise<DataExport.ArcExportResult>;

  /**
   * Dispatches event requesting to encrypt the data.
   *
   * @param data Data to encode
   * @param passphrase Passphrase to use to encode the data
   * @returns Encoded data.
   * @throws {Error} When the password is not set
   * @throws {Error} When the encode event is not handled
   */
  [encryptData](data: string, passphrase: string): Promise<string>;
}
