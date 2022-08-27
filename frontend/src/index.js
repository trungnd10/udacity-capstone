import React, { StrictMode } from 'react'
// import ReactDOM from 'react-dom' // nạp thư viện react-dom
import ReactDOM from 'react-dom/client'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Example } from './app';
import { Auth0Provider } from "@auth0/auth0-react";
import LoginButton from './auth/login';
import LogoutButton from './auth/logout';
import Profile from './auth/profile-simple';
import UseToken from './auth/use/token-simple';
import MyCanvas from './business/my-canvas';

const authConfig = require("../auth_config.json");

if (!authConfig.domain || !authConfig.audience) {
    throw "Please make sure that auth_config.json is in place and populated";
} else {
    console.log('authConfig:', authConfig);
}

// Tạo component App
function App() {
    return (
        <StrictMode>
            <Auth0Provider
                domain={authConfig.domain}
                clientId={authConfig.clientId}
                redirectUri={window.location.origin + authConfig.myWeb}
                audience="https://dev-tigfkctd.us.auth0.com/api/v2/"
                scope="read:current_user update:current_user_metadata"
            >
                <div>
                    {/* <h1>Hello</h1>
                <Button variant="primary">Primary</Button>{' '}
                <Example></Example>
                <LoginButton></LoginButton>
                <LogoutButton></LogoutButton> */}
                    <Profile></Profile>
                    <UseToken></UseToken>
                    <LoginButton></LoginButton>
                    <LogoutButton></LogoutButton>
                    <MyCanvas />
                </div>
            </Auth0Provider >
        </StrictMode>
    )
}

// Render component App vào #root element
// ReactDOM.render(<App />, document.getElementById('root'))
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);