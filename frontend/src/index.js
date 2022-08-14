import React from 'react' // nạp thư viện react
import ReactDOM from 'react-dom' // nạp thư viện react-dom
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Example } from './app';
import { Auth0Provider } from "@auth0/auth0-react";
import LoginButton from './auth/login';
import LogoutButton from './auth/logout';
import Profile from './auth/profile';
import UseToken from './auth/use/token';
const authConfig = require("../auth_config.json");

if (!authConfig.domain || !authConfig.audience) {
    throw "Please make sure that auth_config.json is in place and populated";
} else {
    console.log('authConfig:', authConfig);
}

// Tạo component App
function App() {
    return (
        <Auth0Provider
            domain={authConfig.domain}
            clientId={authConfig.clientId}
            redirectUri={window.location.origin + authConfig.myWeb}
            audience="https://dev-tigfkctd.us.auth0.com/api/v2/"
            scope="read:current_user update:current_user_metadata"
        >
            <div>
                <h1>Hello</h1>
                <Button variant="primary">Primary</Button>{' '}
                <Example></Example>
                <LoginButton></LoginButton>
                <LogoutButton></LogoutButton>
                <Profile></Profile>
                <UseToken></UseToken>
            </div>
        </Auth0Provider >
    )
}

// Render component App vào #root element
ReactDOM.render(<App />, document.getElementById('root'))