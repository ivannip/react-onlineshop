import React, {useState} from "react"

const UserContext = React.createContext([{}, ()=>{}]);

const UserProvider = (props) => {
    const [userState, setUserState] = useState({});

    return (
        <UserContext.Provider value={[userState, setUserState]}>
          {props.children}
        </UserContext.Provider>
      );
}

export {UserContext, UserProvider}