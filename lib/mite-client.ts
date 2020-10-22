import { RestClient } from "typed-rest-client/RestClient";
import { IHeaders } from "typed-rest-client/Interfaces";
import {
    MiteUser, MiteUserResponse, MiteAccount, MiteAccountResponse,
    MiteTracker, MiteTrackerResponse, MiteTimeEntry, MiteTimeEntryResponse, MiteCreateTimeEntryArgs, MiteProject, MiteService, MiteUngroupedTimeEntry, MiteServiceWrapper, MiteProjectWrapper
} from "./mite-models";

export class MiteClient {

    private readonly accountName: string;
    private readonly apiKey: string;
    private readonly client: RestClient;

    private readonly getMyselfEndpoint = 'myself.json';
    private readonly getAccountEndpoint = 'account.json';
    private readonly getCurrentTrackerEndpoint = 'tracker.json';
    private readonly getTrackerEndpoint = 'tracker/';
    private readonly getDailyEndpoint = 'daily.json';
    private readonly createTimeEntryEndpoint = 'time_entries.json';
    private readonly getTimeEntriesEndpoint = 'time_entries/'
    private readonly getActiveProjectsEndpoint = 'projects.json';
    private readonly getActiveServicesEndpoint = 'services.json';
    private readonly getUsersEndpoint = "users.json"

    /**
     * Creates a new instance of the mite API client.
     * @param userAgent User agent for requests.
     * @param accountName The mite account name to connect to.
     * @param apiKey The user's mite API key.
     */
    constructor(userAgent: string, accountName: string, apiKey: string) {
        this.accountName = accountName;
        this.apiKey = apiKey;
        this.client = new RestClient(userAgent, 'https://corsapi.mite.yo.lk/');
    }

    /**
     * Checks whether the client is authorized to make
     * requests to the mite API by sending a test request.
     * 
     * @returns True if authorized.
     */
    public async isAuthorized(): Promise<boolean> {
        const myself = await this.getMyself();
        return myself !== null;
    }

    //#region Account / My User Endpoints

    /**
     * Gets the currently authenticated user's data.
     * @returns User data or null if not found / in case of error.
     */
    public async getMyself(): Promise<MiteUser | null> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        const response = await this.client.get<MiteUserResponse>(`${this.getMyselfEndpoint}`, {
            additionalHeaders: headers
        });

        if (response.statusCode === 200) {
            return response.result!.user;
        }

        return null;
    }

    /**
     * Gets the currently authenticated user's account information.
     * @returns Account data or null if not found / in case of error.
     */
    public async getAccount(): Promise<MiteAccount | null> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        const response = await this.client.get<MiteAccountResponse>(`${this.getAccountEndpoint}`, {
            additionalHeaders: headers
        });

        if (response.statusCode === 200) {
            return response.result!.account;
        }

        return null;
    }

    /**
     * Gets the list of users (Requires admin priviliges).
     * @returns List of user account or empty list in case of error.
     */
    public async getUsers(): Promise<MiteUser[]> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        const response = await this.client.get<{user: MiteUser}[]>(`${this.getUsersEndpoint}`, {
            additionalHeaders: headers
        });

        if (response.statusCode === 200) {
            return response.result!.map(r => r.user);
        }

        return [];
    }

    //#endregion Account / My User Endpoints

    //#region Tracker Endpoints

    /**
     * Gets the currently active tracker.
     * @returns Tracker data or null, if no active tracker.
     */
    public async getTracker(): Promise<MiteTracker | null> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        const response = await this.client.get<MiteTrackerResponse>(`${this.getCurrentTrackerEndpoint}`, {
            additionalHeaders: headers
        });

        if (response.statusCode === 200 && response.result!.tracker !== undefined) {
            return response.result!.tracker!;
        }

        return null;
    }

    /**
     * Starts the time tracker on a time entry.
     * @param id The ID of the time entry to start tracking.
     * @returns Tracker and tracking time entry data.
     */
    public async startTracker(id: number): Promise<MiteTracker | null> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        
        // Need to pass a resource NULL parameter to make the call a PATCH call instead
        // of OPTIONS.
        const response = await this.client.update<MiteTrackerResponse>(`${this.getTrackerEndpoint}${id}.json`, null, {
            additionalHeaders: headers
        });

        if (response.statusCode === 200 && response.result!.tracker !== undefined) {
            return response.result!.tracker!;
        }

        return null;
    }

    /**
     * Stops the time tracker on a given time entry.
     * @param id The ID of the time entry to stop tracking.
     * @returns Data of stopped tracker and time entry.
     */
    public async stopTracker(id: number): Promise<MiteTracker | null> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        const response = await this.client.del<MiteTrackerResponse>(`${this.getTrackerEndpoint}${id}.json`, {
            additionalHeaders: headers
        });

        if (response.statusCode === 200 && response.result!.tracker !== undefined) {
            return response.result!.tracker!;
        }

        return null;
    }

    //#endregion Tracker Endpoints

    //#region Time Entries Endpoints

    /**
     * Gets all existing time entries for the current day.
     * @returns Time entries, if any.
     */
    public async getTimeEntriesForToday(): Promise<MiteTimeEntry[]> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        const response = await this.client.get<MiteUngroupedTimeEntry[]>(`${this.getDailyEndpoint}`, {
            additionalHeaders: headers
        });

        if (response.statusCode === 200) {
            return response.result!.map(r => r.time_entry);
        }

        return [];
    }

    /**
     * Gets all existing time entries for a given date.
     * @returns Time entries, if any.
     */
    public async getTimeEntriesForDate(date: Date): Promise<MiteTimeEntry[]> {
        const formattedDate = date.toISOString().split('T')[0];
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;
        
        const response = await this.client.get<MiteUngroupedTimeEntry[]>(`${this.getTimeEntriesEndpoint}?at=${formattedDate}`, {
            additionalHeaders: headers,
        });

        if (response.statusCode === 200) {
            return response.result!.map(r => r.time_entry);
        }

        return [];
    }

    /**
     * Gets the currently tracking time entry, if any.
     * @returns Currently tracking time entry, if any. Otherwise null.
     */
    public async getTrackingTimeEntry(): Promise<MiteTimeEntry | null> {
        const tracker = await this.getTracker();
        if (tracker && tracker.tracking_time_entry) {
            const timeEntry = await this.getTimeEntry(tracker.tracking_time_entry.id);

            if (timeEntry !== null) {
                return timeEntry;
            }
        }

        return null;
    }

    /**
     * Gets a single time entry by ID.
     * @param id The ID of the time entry to lookup.
     * @returns Time entry data, if found. Otherwise null.
     */
    public async getTimeEntry(id: number): Promise<MiteTimeEntry | null> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        const response = await this.client.get<MiteTimeEntryResponse>(`${this.getTimeEntriesEndpoint}${id}.json`, {
            additionalHeaders: headers
        });

        if (response.statusCode === 200) {
            return response.result!.time_entry;
        }

        return null;
    }

    /**
     * Creates a new time entry.
     * @param args Arguments passed to mite for the time entry created.
     * @returns Created time entry data.
     */
    public async createTimeEntry(args: MiteCreateTimeEntryArgs): Promise<MiteTimeEntry | null> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        const response = await this.client.create<MiteTimeEntryResponse>(this.createTimeEntryEndpoint, args, {
            additionalHeaders: headers
        });

        if (response.statusCode === 201) {
            return response.result!.time_entry;
        }

        return null;
    }

    //#endregion Time Entries Endpoints

    //#region Projects Endpoints

    /**
     * Gets all active mite projects for the current user.
     * @returns List of mite projects found.
     */
    public async getActiveProjects(): Promise<MiteProject[]> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        const response = await this.client.get<MiteProjectWrapper[]>(`${this.getActiveProjectsEndpoint}`, {
            additionalHeaders: headers
        });

        if (response.statusCode === 200) {
            return response.result!.map(p => p.project);
        }

        return [];
    }

    //#endregion Projects Endpoints

    //#region Services Endpoints

    /**
     * Gets all active mite services for the current user.
     * @returns List of mite services found.
     */
    public async getActiveServices(): Promise<MiteService[]> {
        let headers: IHeaders = {};
        headers['X-MiteAccount'] = this.accountName;
        headers['X-MiteApiKey'] = this.apiKey;

        const response = await this.client.get<MiteServiceWrapper[]>(`${this.getActiveServicesEndpoint}`, {
            additionalHeaders: headers
        });

        if (response.statusCode === 200) {
            return response.result!.map(s => s.service);
        }

        return [];
    }

    //#endregion Services Endpoints
}
