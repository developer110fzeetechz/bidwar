import { router, useNavigation } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useMMKVBoolean('isLoggedIn');
    const [userToken, setUserToken] = useMMKVString('userToken');
    const [userRole, setUserRole] = useMMKVString('userRole');
    const [mydetails, setMyDetails] = useMMKVString('me');
    const navigation = useNavigation()
    
    const login = (token, role) => {
        setUserToken(token);
        setUserRole(role)
        setIsLoggedIn(true);
    }
    const logout = () => {
        setUserToken("")
        setIsLoggedIn(false);
    }

    useEffect(() => {
       if(isLoggedIn){
        //    navigation.navigate('(home)')
        router.replace('(home)')
        } else {
           router.replace('auth')
     }
    }, [isLoggedIn])
    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout,userToken, setUserToken ,
        userRole, setUserRole,
        mydetails, setMyDetails
         }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
