import { createServer } from 'vite'

const server=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'silent'})
try{
  const curriculum=await server.ssrLoadModule('/src/learningCurriculum.ts')
  const audit=curriculum.learningValidation()
  if(audit.issues.length)throw new Error(`Learning validation failed:\n${audit.issues.join('\n')}`)
  process.stdout.write(`Learning validation passed: ${audit.modules} authored modules, ${audit.schools} schools, ${audit.archetypes} archetypes.\n`)
}finally{
  await server.close()
}
