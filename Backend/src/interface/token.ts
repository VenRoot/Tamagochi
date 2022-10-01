export interface iToken {
    token: string;
    user?: {
        username: string;
        keepLoggedIn: boolean;
    }
    created: Date;
}