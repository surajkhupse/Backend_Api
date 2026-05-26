declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGO_URI?: string;
    JWT_SECRET?: string;
    /** Access JWT duration (e.g. `15m`, `1h`). Default `15m`. */
    JWT_ACCESS_EXPIRES?: string;
    /** Refresh session length in ms (default 7 days). */
    REFRESH_TOKEN_TTL_MS?: string;
    /** Failed password attempts before temporary lock (default 5). */
    ACCOUNT_LOCK_MAX_ATTEMPTS?: string;
    /** Lock duration in ms after too many failures (default 15 minutes). */
    ACCOUNT_LOCK_DURATION_MS?: string;
    CLIENT_URL?: string;
    /** Public base URL of this API (no trailing slash), used for Google OAuth redirect_uri */
    API_PUBLIC_URL?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    /** Path on the SPA after SSO success (default `/sso-callback`). Token is appended as `?token=` */
    SSO_SUCCESS_PATH?: string;
    NODE_ENV?: string;
    /** Set to `false` to disable Express `trust proxy` (default enables one proxy hop for accurate IP). */
    TRUST_PROXY?: string;
    SWAGGER_BASE_URL?: string;
  }
}
