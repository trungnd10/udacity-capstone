import React, { useState, useEffect } from 'react';
const authConfig = require("../../../auth_config.json");
import { useAuth0 } from "@auth0/auth0-react";
import Button from 'react-bootstrap/Button';

const UseToken = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState(null);

    const getUserMetadata = async () => {
        const domain = authConfig.domain;

        try {
            const accessToken = await getAccessTokenSilently({
                audience: `https://${domain}/api/v2/`,
                scope: "read:current_user",
            });

            console.log('token:', accessToken)
            setToken(accessToken);

            const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
            console.log('userDetailsByIdUrl:', userDetailsByIdUrl);

            // const metadataResponse = await fetch(userDetailsByIdUrl, {
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`,
            //     },
            // });

            // const { user_metadata } = await metadataResponse.json();

            // setUserMetadata(user_metadata);
        } catch (e) {
            console.log('error:', e.message);
        }
    };

    useEffect(() => {
        getUserMetadata();
        console.log('here!')
    }, [getAccessTokenSilently, user?.sub]);

    const handleClick = () => {
        getUserMetadata()
        console.log('ok!')
    };

    return (
        isAuthenticated && (
            <div>
                <Button
                    variant="primary"
                    disabled={false}
                    onClick={!false ? handleClick : null}
                >Click Me</Button>
                hello {token}
            </div>
        )
    );
};

export default UseToken;

