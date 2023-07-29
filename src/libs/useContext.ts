import { createContext } from 'react'

interface User {
  id: string
  name: string
  email: string
  // Add additional user properties as needed
}

// If the user is not logged in, the context value will be `null`
const UserContext = createContext<User | null>(null)

export default UserContext