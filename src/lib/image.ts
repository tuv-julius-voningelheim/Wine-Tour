const MAX_EDGE = 1200
const MAX_INPUT_BYTES = 12 * 1024 * 1024

export async function prepareBottlePhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  if (file.size > MAX_INPUT_BYTES) throw new Error('The original image is too large. Choose a photo under 12 MB.')
  const source = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(source.width, source.height))
  const width = Math.max(1, Math.round(source.width * scale))
  const height = Math.max(1, Math.round(source.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('This browser cannot prepare the photo.')
  context.drawImage(source, 0, 0, width, height)
  source.close()
  return canvas.toDataURL('image/webp', .82)
}
