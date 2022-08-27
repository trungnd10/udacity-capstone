import React, { useState, useEffect } from 'react';
const authConfig = require("../../../auth_config.json");
import { useAuth0 } from "@auth0/auth0-react";
import Button from 'react-bootstrap/Button';
import { UDACITY_TOKEN, UDACITY_USER_ID, UDACITY_USER_SUB } from '../../const';

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
            console.log('user:', user)
            console.log('user.sub:', user.sub)

            localStorage.setItem(UDACITY_TOKEN, accessToken);
            localStorage.setItem(UDACITY_USER_ID, user.nickname);
            localStorage.setItem(UDACITY_USER_SUB, user.sub);

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
            </div>
        )
    );
};

export default UseToken;

