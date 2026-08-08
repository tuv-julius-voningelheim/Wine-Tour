import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ensureDemoAdmin, hashPassword, repository } from './data/repository'
import type { User } from './types'

type AuthValue={user:User|null;ready:boolean;login:(username:string,password:string)=>Promise<string|null>;register:(username:string,password:string)=>Promise<string|null>;logout:()=>void}
const AuthContext=createContext<AuthValue|null>(null)
export function AuthProvider({children}:{children:ReactNode}){
  const [ready,setReady]=useState(false); const [user,setUser]=useState<User|null>(null)
  useEffect(()=>{ensureDemoAdmin().then(()=>{const id=repository.session.get();setUser(repository.users.all().find(u=>u.id===id)??null);setReady(true)})},[])
  const value=useMemo<AuthValue>(()=>({user,ready,login:async(username,password)=>{const found=repository.users.all().find(u=>u.username.toLowerCase()===username.trim().toLowerCase());if(!found||await hashPassword(password,found.salt)!==found.passwordHash)return 'Those details do not match a local account.';repository.session.set(found.id);setUser(found);return null},register:async(username,password)=>{if(username.trim().length<3)return 'Choose a username with at least three characters.';if(password.length<8)return 'Use at least eight characters for your password.';const users=repository.users.all();if(users.some(u=>u.username.toLowerCase()===username.trim().toLowerCase()))return 'That username is already used in this browser.';const salt=crypto.randomUUID();const next:User={id:crypto.randomUUID(),username:username.trim(),salt,passwordHash:await hashPassword(password,salt),role:'member'};users.push(next);repository.users.save(users);repository.session.set(next.id);setUser(next);return null},logout:()=>{repository.session.set(null);setUser(null)}}),[user,ready])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('AuthProvider missing');return value}
