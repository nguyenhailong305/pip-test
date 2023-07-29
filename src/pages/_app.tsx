import "@/styles/globals.css";
import UserContext from "@/utils/useContext";
import { AppProps } from "next/app";
import React, { useState } from "react";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  

  return (
    <UserContext.Provider
      value={{
        user ,
        userRoles,
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

export default App;
