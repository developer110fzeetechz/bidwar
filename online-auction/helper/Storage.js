import { MMKV } from "react-native-mmkv"

export const addtoStorage = () => {
    const storage = new MMKV()
    storage.set('name', 'Md Atiq')
}

export const getUserDetails = () => {
    const storage = new MMKV()
    const user = storage.getString('me')
    if (user) {
        return JSON.parse(user)
    }
    return {
        name: 'No User',
        age: 0
    }
}

export const isAdmin = () => {
    const storage = new MMKV()
    const user = storage.getString('me')
    if (user) {
        const userObj = JSON.parse(user)
        if (userObj.role === 'admin') {
            return true
        }

    }
    return
}
export const isOrganisation = () => {
    const storage = new MMKV()
    const user = storage.getString('me')
    if (user) {
        const userObj = JSON.parse(user)
        if (userObj.role === 'organisation') {
            return true
        }

    }
    rerurn 
}

const getToken = () => {
    const storage = new MMKV()
    return storage.getString('token')
}