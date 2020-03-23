export interface MiteUngroupedTimeEntry {
    time_entry: MiteTimeEntry;
}

export interface MiteCreateTimeEntryArgs {
    time_entry: MiteCreateTimeEntryPayload;
}

export interface MiteCreateTimeEntryPayload {
    date_at?: Date;
    minutes?: number;
    note?: string;
    user_id?: number;
    project_id?: number;
    service_id?: number;
    locked?: boolean;
}

export interface MiteAccountResponse {
    account: MiteAccount;
}

export interface MiteAccount {
    id: number;
    name: string;
    title: string;
    currency: string;
    created_at: Date;
    updated_at: Date;
}

export interface MiteUserResponse {
    user: MiteUser;
}

export interface MiteUser {
    id: number;
    name: string;
    email: string;
    note: string;
    archived: boolean;
    role: string;
    language: string;
    created_at: Date;
    updated_at: Date;
}

export interface MiteTrackerResponse {
    tracker?: MiteTracker;
}

export interface MiteTracker {
    tracking_time_entry: MiteTrackingTimeEntry;
}

export interface MiteTrackingTimeEntry {
    id: number;
    minutes: number;
    since: Date;
}

export interface MiteTimeEntryResponse {
    time_entry: MiteTimeEntry;
}

export interface MiteTimeEntry {
    id: number;
    minutes: number;
    date_at: Date;
    note: string;
    billable: boolean;
    locked: boolean;
    revenue: any;
    hourly_rate: number;
    user_id: number;
    user_name: string;
    project_id: number;
    project_name: string;
    customer_id: number;
    customer_name: string;
    service_id: number;
    service_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface MiteProjectWrapper {
    project: MiteProject;
}

export interface MiteProject {
    id: number;
    name: string;
    note: string;
    customer_id: number;
    customer_name: string;
    budget: number;
    budget_type: string;
    hourly_rate: number;
    archived: boolean;
    active_hourly_rate: string;
    created_at: Date;
    updated_at: Date;
}

export interface MiteServiceWrapper {
    service: MiteService;
}

export interface MiteService {
    id: number;
    name: string;
    note: string;
    hourly_rate: number;
    archived: boolean;
    billable: boolean;
    created_at: Date;
    updated_at: Date;
}