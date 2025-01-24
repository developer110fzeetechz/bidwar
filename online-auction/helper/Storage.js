import { MMKV } from "react-native-mmkv"

export const addtoStorage =()=>{
    const storage = new MMKV()
    storage.set('name','Md Atiq')
}

export const getUserDetails =()=>{
    const storage = new MMKV()
const user = storage.getString('me')
if(user){
    return JSON.parse(user)
}
return {
    name: 'No User',
    age: 0
}
}