export interface User {
    id: number;
    username: string;
    name: string;
    avatar?: string;
}
export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthState {
    user: User | null;
    sessionId: string | null;
    requestToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthTokenResponse {
    success: boolean;
    expires_at: string;
    request_token: string;
}

export interface SessionResponse {
    success: boolean;
    session_id: string;
}

export interface ValidateTokenWithLoginRequest {
    username: string;
    password: string;
    request_token: string;
}