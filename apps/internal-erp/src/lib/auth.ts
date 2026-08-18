import { getSessionClaims } from './session';

export async function getSession() {
    const claims = await getSessionClaims();
    if (!claims) return null;
    return {
        ...claims,
        token: "MOCK_TOKEN"
    };
}
