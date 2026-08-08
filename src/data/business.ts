import type {
  ApprovalRecord,
  BusinessWorkspace,
  MerchantOffer,
  PartnerProfile,
  PlatformFeeConfiguration,
  PromotionalPlacement,
  TastingEvent,
  WineryPageSection,
  WorkspaceMembership,
} from '../types'
import { producers, regions, wines } from './catalog'

export const demoWorkspaces: BusinessWorkspace[] = [
  { id:'workspace-member', name:'My private table', role:'member', verification:'unverified', publishState:'draft', plan:'member', planStatus:'active', checklist:[{id:'profile',complete:true},{id:'cellar',complete:false},{id:'private-tasting',complete:false}] },
  { id:'workspace-host', name:'Atlas Tasting Studio', role:'host', verification:'verified', publishState:'published', plan:'studio', planStatus:'trial', checklist:[{id:'profile',complete:true},{id:'event',complete:true},{id:'storyline',complete:false},{id:'payouts',complete:false}] },
  { id:'workspace-winery', name:'Cloudy Bay', role:'winery', verification:'pending', publishState:'draft', plan:'partner', planStatus:'trial', checklist:[{id:'claim',complete:true},{id:'story',complete:true},{id:'wines',complete:true},{id:'verification',complete:false}] },
  { id:'workspace-merchant', name:'The Bottle Library', role:'merchant', verification:'pending', publishState:'draft', plan:'partner', planStatus:'trial', checklist:[{id:'profile',complete:true},{id:'markets',complete:true},{id:'offer',complete:false},{id:'verification',complete:false}] },
  { id:'workspace-admin', name:'Vine Atlas Editorial', role:'admin', verification:'verified', publishState:'published', plan:'custom', planStatus:'active', checklist:[{id:'relations',complete:true},{id:'approvals',complete:false},{id:'placements',complete:true}] },
]

export const demoMemberships: WorkspaceMembership[] = demoWorkspaces.map(workspace=>({
  id:`membership-${workspace.id}`,
  workspaceId:workspace.id,
  userId:'local-demo-user',
  role:workspace.role,
  permissions:workspace.role==='admin'?['view','edit','publish','commerce','moderate']:workspace.role==='member'?['view','edit']:['view','edit','publish','commerce'],
}))

export const demoPartnerProfiles: PartnerProfile[] = [
  { id:'atlas-tasting-studio', workspaceId:'workspace-host', kind:'host', displayName:'Atlas Tasting Studio', tagline:'Guided evenings where place, process and the glass meet.', story:'A host practice built around comparison, sensory calibration and connected learning chapters.', languages:['English','Deutsch','Français'], markets:['Europe','Online'], serviceArea:'Berlin and online', contactUrl:'https://example.com/host-contact', verification:'verified', publishState:'published', expertise:['Riesling','Cool climates','Blind tasting'] },
  { id:'cloudy-bay-studio', workspaceId:'workspace-winery', kind:'winery', displayName:'Cloudy Bay', producerId:'cloudy-bay', tagline:'A living estate page connected to Marlborough.', story:'Estate-authored sections sit beside protected editorial region and grape relationships.', languages:['English'], markets:['New Zealand','Europe'], serviceArea:'Marlborough, New Zealand', shopUrl:'https://www.cloudybay.com/', contactUrl:'https://www.cloudybay.com/', verification:'pending', publishState:'draft', expertise:['Sauvignon Blanc','Pinot Noir','Traditional-method sparkling'] },
  { id:'bottle-library', workspaceId:'workspace-merchant', kind:'merchant', displayName:'The Bottle Library', tagline:'Contextual wine offers with transparent market and stock information.', story:'A demo merchant profile showing how commerce can connect to a wine without becoming an editorial source.', languages:['English','Deutsch'], markets:['Germany','France'], serviceArea:'EU fulfilment demo', contactUrl:'https://example.com/merchant-contact', verification:'pending', publishState:'draft', expertise:['Fine wine','Mixed cases','Temperature-controlled delivery'] },
]

export const demoEvents: TastingEvent[] = [
  { id:'riesling-latitude-light', workspaceId:'workspace-host', hostProfileId:'atlas-tasting-studio', title:'Riesling: latitude & light', summary:'Compare Mosel, Rheingau and Clare Valley while learning how acidity, ripeness and site shape the glass.', modality:'hybrid', visibility:'public', publishState:'published', startsAt:'2026-09-19T18:30:00.000Z', durationMinutes:120, language:'en', regionId:'mosel', venue:'Berlin · venue shared after booking', secureJoinLink:'Secure link shared after booking', capacity:18, ticket:{type:'paid',amountMinor:6800,currency:'EUR',platformFeeBps:800}, cancellationTerms:'Full refund until 72 hours before the event.', featuredWineIds:['wehlener-sonnenuhr-riesling-auslese-230','polish-hill-riesling-325'] },
  { id:'marlborough-beyond-citrus', workspaceId:'workspace-host', hostProfileId:'atlas-tasting-studio', title:'Marlborough beyond citrus', summary:'A focused online tasting on subregional texture, harvest decisions and Sauvignon Blanc beyond a single aroma shorthand.', modality:'online', visibility:'public', publishState:'published', startsAt:'2026-10-03T17:00:00.000Z', durationMinutes:75, language:'en', regionId:'marlborough', secureJoinLink:'Secure link shared after booking', capacity:40, ticket:{type:'free',amountMinor:0,currency:'EUR',platformFeeBps:0}, cancellationTerms:'Cancel any time so the host can plan attendance.', featuredWineIds:['sauvignon-blanc-19','te-koko-20'] },
  { id:'pinot-place-table', workspaceId:'workspace-host', hostProfileId:'atlas-tasting-studio', title:'Pinot Noir: a table of places', summary:'A small in-person table comparing site, whole-bunch choices and élevage across Burgundy, Oregon and Central Otago.', modality:'in-person', visibility:'public', publishState:'published', startsAt:'2026-10-24T17:30:00.000Z', durationMinutes:150, language:'de', regionId:'central-otago', venue:'Hamburg · studio address after booking', capacity:12, ticket:{type:'paid',amountMinor:9400,currency:'EUR',platformFeeBps:800}, cancellationTerms:'Transfer your place or cancel for a refund until seven days before the event.', featuredWineIds:['block-3-pinot-noir-345','the-eyrie-pinot-noir-281'] },
  { id:'private-cellar-circle', workspaceId:'workspace-member', hostProfileId:'atlas-tasting-studio', title:'Private cellar circle', summary:'An invite-only table that is never listed in public discovery.', modality:'in-person', visibility:'private', publishState:'draft', startsAt:'2026-11-07T18:00:00.000Z', durationMinutes:90, language:'de', venue:'Private location', capacity:8, ticket:{type:'free',amountMinor:0,currency:'EUR',platformFeeBps:0}, cancellationTerms:'Host-managed private invitation.', featuredWineIds:[], inviteCode:'VINE-7F2' },
]

export const demoWinerySections: WineryPageSection[] = [
  {id:'section-hero',workspaceId:'workspace-winery',type:'hero',heading:'Marlborough, read from the estate',body:'A calm opening that connects the estate voice with the atlas context.',visible:true,order:1},
  {id:'section-story',workspaceId:'workspace-winery',type:'story',heading:'Our story',body:'An estate-authored narrative, clearly separate from editorial wine facts.',visible:true,order:2},
  {id:'section-vineyards',workspaceId:'workspace-winery',type:'vineyards',heading:'Vineyards',body:'Blocks, farming decisions and the seasonal work behind the fruit.',visible:true,order:3},
  {id:'section-cellar',workspaceId:'workspace-winery',type:'cellar',heading:'Cellar philosophy',body:'Fermentation, vessels and maturation explained in the producer’s own voice.',visible:true,order:4},
  {id:'section-wines',workspaceId:'workspace-winery',type:'wines',heading:'Wines',body:'Catalog-linked wines with editorial relations reviewable by Vine Atlas.',visible:true,order:5},
  {id:'section-visits',workspaceId:'workspace-winery',type:'visits',heading:'Visit',body:'Opening details, experiences and a direct enquiry route.',visible:false,order:6},
]

export const demoOffers: MerchantOffer[] = [
  {id:'offer-cloudy-bay-sb',workspaceId:'workspace-merchant',wineId:'sauvignon-blanc-19',destinationUrl:'https://example.com/demo-offer',priceMinor:3290,currency:'EUR',market:'Germany',stock:'in-stock',disclosure:'retailer',publishState:'draft'},
  {id:'offer-te-koko',workspaceId:'workspace-merchant',wineId:'te-koko-20',destinationUrl:'https://example.com/demo-affiliate',priceMinor:5490,currency:'EUR',market:'Germany',stock:'low',disclosure:'affiliate',publishState:'draft'},
]

export const demoPlacements: PromotionalPlacement[] = [
  {id:'placement-host-home',workspaceId:'workspace-host',partnerProfileId:'atlas-tasting-studio',surface:'home',startsAt:'2026-09-01',endsAt:'2026-10-31',priority:2,disclosure:'featured',enabled:true},
  {id:'placement-winery-map',workspaceId:'workspace-winery',partnerProfileId:'cloudy-bay-studio',surface:'map',startsAt:'2026-09-01',endsAt:'2026-09-30',priority:1,disclosure:'sponsored',enabled:false},
]

export const demoApprovals: ApprovalRecord[] = [
  {id:'approval-winery-claim',workspaceId:'workspace-winery',kind:'winery-claim',subjectId:'cloudy-bay-studio',title:'Cloudy Bay workspace claim',submittedAt:'2026-08-08T09:00:00.000Z',state:'pending'},
  {id:'approval-offer',workspaceId:'workspace-merchant',kind:'offer',subjectId:'offer-cloudy-bay-sb',title:'Cloudy Bay Sauvignon Blanc merchant offer',submittedAt:'2026-08-08T09:30:00.000Z',state:'pending'},
  {id:'approval-event',workspaceId:'workspace-host',kind:'public-event',subjectId:'pinot-place-table',title:'Pinot Noir: a table of places',submittedAt:'2026-08-08T10:00:00.000Z',state:'pending'},
]

export const demoFeeConfiguration: PlatformFeeConfiguration = {
  recurringPartnerPlans:true,
  ticketFeeBps:800,
  merchantAffiliateLinks:true,
  paymentsMode:'disabled-demo',
}

export function validateBusinessData(){
  const errors:string[]=[]
  const workspaceIds=new Set(demoWorkspaces.map(item=>item.id))
  const profileIds=new Set(demoPartnerProfiles.map(item=>item.id))
  const producerIds=new Set(producers.map(item=>item.id))
  const wineIds=new Set(wines.map(item=>item.id))
  const regionIds=new Set(regions.map(item=>item.id))
  demoMemberships.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Membership ${item.id} has missing workspace ${item.workspaceId}`)})
  demoPartnerProfiles.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Profile ${item.id} has missing workspace ${item.workspaceId}`);if(item.producerId&&!producerIds.has(item.producerId))errors.push(`Profile ${item.id} has missing producer ${item.producerId}`)})
  demoEvents.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Event ${item.id} has missing workspace ${item.workspaceId}`);if(!profileIds.has(item.hostProfileId))errors.push(`Event ${item.id} has missing host ${item.hostProfileId}`);if(item.regionId&&!regionIds.has(item.regionId))errors.push(`Event ${item.id} has missing region ${item.regionId}`);item.featuredWineIds.forEach(id=>{if(!wineIds.has(id))errors.push(`Event ${item.id} has missing wine ${id}`)});const role=demoWorkspaces.find(workspace=>workspace.id===item.workspaceId)?.role;if(role==='member'&&(item.visibility!=='private'||item.publishState==='published'))errors.push(`Member event ${item.id} must remain private and unpublished`)})
  demoWinerySections.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Section ${item.id} has missing workspace ${item.workspaceId}`)})
  demoOffers.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Offer ${item.id} has missing workspace ${item.workspaceId}`);if(!wineIds.has(item.wineId))errors.push(`Offer ${item.id} has missing wine ${item.wineId}`);if(!/^https:\/\//.test(item.destinationUrl))errors.push(`Offer ${item.id} requires an https destination`)})
  demoPlacements.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Placement ${item.id} has missing workspace ${item.workspaceId}`);if(!profileIds.has(item.partnerProfileId))errors.push(`Placement ${item.id} has missing profile ${item.partnerProfileId}`);if(item.startsAt>item.endsAt)errors.push(`Placement ${item.id} ends before it starts`)})
  demoApprovals.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Approval ${item.id} has missing workspace ${item.workspaceId}`)})
  if(demoFeeConfiguration.paymentsMode!=='disabled-demo')errors.push('Demo payments must remain disabled')
  return errors
}
