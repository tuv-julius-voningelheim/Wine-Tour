import type { CellarItem, TastingNote, User } from '../types'

const keys = {
  users:'vine-atlas.users', session:'vine-atlas.session', cellar:'vine-atlas.cellar', notes:'vine-atlas.notes', ratings:'vine-atlas.ratings', additions:'vine-atlas.additions'
} as const

function read<T>(key:string, fallback:T):T {
  try { const value=localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback }
}
function write<T>(key:string,value:T){ localStorage.setItem(key,JSON.stringify(value)) }

export const repository = {
  users: { all:()=>read<User[]>(keys.users,[]), save:(users:User[])=>write(keys.users,users) },
  session: { get:()=>read<string|null>(keys.session,null), set:(id:string|null)=>write(keys.session,id) },
  cellar: { all:()=>read<CellarItem[]>(keys.cellar,[]), save:(items:CellarItem[])=>write(keys.cellar,items) },
  notes: { all:()=>read<TastingNote[]>(keys.notes,[]), save:(notes:TastingNote[])=>write(keys.notes,notes) },
  ratings: { all:()=>read<Record<string,number>>(keys.ratings,{}), save:(ratings:Record<string,number>)=>write(keys.ratings,ratings) },
  additions: { all:()=>read<Record<string,unknown>[]>(keys.additions,[]), save:(items:Record<string,unknown>[])=>write(keys.additions,items) },
}

export async function hashPassword(password:string,salt:string){
  const bytes=new TextEncoder().encode(`${salt}:${password}`)
  const digest=await crypto.subtle.digest('SHA-256',bytes)
  return [...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('')
}

const ADMIN_USERNAME='atlas-admin'
const ADMIN_PASSWORD_SALT='vine-atlas-demo-v2'
const ADMIN_PASSWORD_HASH='8e77f9e520cad84a6d3fd4c6d5490992d94e12aedab64aaabe01e60c42752734'

export async function ensureDemoAdmin(){
  const users=repository.users.all()
  const existing=users.find(user=>user.username===ADMIN_USERNAME)
  if(existing){
    existing.salt=ADMIN_PASSWORD_SALT
    existing.passwordHash=ADMIN_PASSWORD_HASH
    existing.role='admin'
  } else {
    users.push({id:'demo-admin',username:ADMIN_USERNAME,salt:ADMIN_PASSWORD_SALT,passwordHash:ADMIN_PASSWORD_HASH,role:'admin'})
  }
  repository.users.save(users)
}
