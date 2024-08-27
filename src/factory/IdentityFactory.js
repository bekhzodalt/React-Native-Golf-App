import { Auth, Logger } from 'aws-amplify';
const logger = new Logger('IdentityFactory');
const getIdentity = async (bypassCache = false) => {
    try {
        const currentSession = await Auth.currentSession();

        const payload = currentSession.idToken.payload;

        const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();

        const { attributes } = currentAuthenticatedUser;
        const { email, sub } = attributes;
        const data = {
            email,
            sub,
        };

        return data;
    } catch (err) {
        console.log("error");
        logger.info("errax", err);
    }
};

export default {
    getIdentity,
};