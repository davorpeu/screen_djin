export interface SessionState {
    sessionId: string | null;
    requestToken: string | null;
    loading: boolean;
    error: string | null;
}

export interface AuthRequest {
    username: string;
    password: string;
}