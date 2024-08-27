import React from 'react';
import Amplify, { Storage } from 'aws-amplify';

import Setup from './src/boot/setup';
import ContextManager from './src/contexts/ContextManager';

Amplify.configure({
    Auth: {
        identityPoolId: 'us-east-1:', //REQUIRED - Amazon Cognito Identity Pool ID
        region: 'us-east-1', // REQUIRED - Amazon Cognito Region
        userPoolId: 'us-east-1', //OPTIONAL - Amazon Cognito User Pool ID
        userPoolWebClientId: '', //OPTIONAL - Amazon Cognito Web Client ID
    },
    Storage: {
        AWSS3: {
            bucket: 'accupin-green-images-prod', //REQUIRED -  Amazon S3 bucket name
            region: 'us-east-1', //OPTIONAL -  Amazon service region,

        }
    }
});

Storage.configure({ track: true, level: "private" });

function App(): JSX.Element {

    return (
        <ContextManager>
            <Setup />
        </ContextManager>
    );
}

export default App;
