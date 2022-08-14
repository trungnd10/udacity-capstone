import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
const authConfig = require("../../auth_config.json");

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin + authConfig.myWeb })}>
      Log Out
    </button>
  );
};

export default LogoutButton;