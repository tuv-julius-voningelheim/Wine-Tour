import type { ApprovalRecord, BusinessWorkspace, CellarItem, MerchantOffer, PartnerProfile, PlatformFeeConfiguration, PromotionalPlacement, TastingEvent, TastingJourney, TastingNote, User, WineryPageSection, WorkspaceMembership } from '../types'

const keys = {
  users:'vine-atlas.users', session:'vine-atlas.session', cellar:'vine-atlas.cellar', notes:'vine-atlas.notes', ratings:'vine-atlas.ratings', additions:'vine-atlas.additions', journeys:'vine-atlas.journeys',
  workspaces:'vine-atlas.business.workspaces', memberships:'vine-atlas.business.memberships', partnerProfiles:'vine-atlas.business.partner-profiles', events:'vine-atlas.business.events', winerySections:'vine-atlas.business.winery-sections', offers:'vine-atlas.business.offers', placements:'vine-atlas.business.placements', approvals:'vine-atlas.business.approvals', feeConfiguration:'vine-atlas.business.fee-configuration'
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
  journeys: { all:()=>read<TastingJourney[]>(keys.journeys,[]), save:(items:TastingJourney[])=>write(keys.journeys,items) },
  workspaces: { all:(fallback:BusinessWorkspace[]=[])=>read<BusinessWorkspace[]>(keys.workspaces,fallback), save:(items:BusinessWorkspace[])=>write(keys.workspaces,items) },
  memberships: { all:(fallback:WorkspaceMembership[]=[])=>read<WorkspaceMembership[]>(keys.memberships,fallback), save:(items:WorkspaceMembership[])=>write(keys.memberships,items) },
  partnerProfiles: { all:(fallback:PartnerProfile[]=[])=>read<PartnerProfile[]>(keys.partnerProfiles,fallback), save:(items:PartnerProfile[])=>write(keys.partnerProfiles,items) },
  events: { all:(fallback:TastingEvent[]=[])=>read<TastingEvent[]>(keys.events,fallback), save:(items:TastingEvent[])=>write(keys.events,items) },
  winerySections: { all:(fallback:WineryPageSection[]=[])=>read<WineryPageSection[]>(keys.winerySections,fallback), save:(items:WineryPageSection[])=>write(keys.winerySections,items) },
  offers: { all:(fallback:MerchantOffer[]=[])=>read<MerchantOffer[]>(keys.offers,fallback), save:(items:MerchantOffer[])=>write(keys.offers,items) },
  placements: { all:(fallback:PromotionalPlacement[]=[])=>read<PromotionalPlacement[]>(keys.placements,fallback), save:(items:PromotionalPlacement[])=>write(keys.placements,items) },
  approvals: { all:(fallback:ApprovalRecord[]=[])=>read<ApprovalRecord[]>(keys.approvals,fallback), save:(items:ApprovalRecord[])=>write(keys.approvals,items) },
  feeConfiguration: { get:(fallback:PlatformFeeConfiguration)=>read<PlatformFeeConfiguration>(keys.feeConfiguration,fallback), save:(item:PlatformFeeConfiguration)=>write(keys.feeConfiguration,item) },
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
