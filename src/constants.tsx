export const GITLAB_URL = "http://gitlab.bluekaktus.com/api/v4";
export const PRIVATE_TOKEN = "LKwVFMX5-rxh4xpF3EA1";
export function BASE_HEADERS(private_token: string | null) {
    return {
    headers: {
        "PRIVATE-TOKEN": private_token || PRIVATE_TOKEN,
    }
}
};