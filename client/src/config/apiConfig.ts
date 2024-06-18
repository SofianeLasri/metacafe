const serverBaseUrl = import.meta.env.VITE_BACKEND_URL as string;

const apiConfig = {
    serverBaseUrl,
    userApiUrl: `${serverBaseUrl}/api/user`,
    auth: {
        login: `${serverBaseUrl}/api/auth/login`,
        register: `${serverBaseUrl}/api/auth/register`,
    },
    user: {
        me: `${serverBaseUrl}/api/user/me`,
        updateProfilePic: `${serverBaseUrl}/api/user/me/updateProfilePic`,
        centersOfInterest: `${serverBaseUrl}/api/user/me/centersOfInterest`,
    },
    attachment: `${serverBaseUrl}/api/attachment/`,
    centerOfInterest: {
        base: `${serverBaseUrl}/api/centerOfInterest`,
        matchByName: `${serverBaseUrl}/api/centerOfInterest/matchByName`,
    },
    friends: `${serverBaseUrl}/api/user/me/friends`,
    activity: `${serverBaseUrl}/api/user/me/activity`,
};

export default apiConfig;