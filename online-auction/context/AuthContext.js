import { router, useNavigation } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useMMKVBoolean('isLoggedIn');
    const [userToken, setUserToken] = useMMKVString('userToken');
    const navigation = useNavigation()
    
    const login = (token) => {
        setUserToken(token);
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
        <AuthContext.Provider value={{ isLoggedIn, login, logout,userToken, setUserToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
