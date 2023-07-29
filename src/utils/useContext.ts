import { createContext } from 'react'

interface UserContextType {
    userRoles : any[]  ,
    user : any
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export default UserContext