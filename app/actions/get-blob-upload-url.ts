'use server'

import { generateUploadUrl } from '@vercel/blob'

export async function getBlobUploadUrl() {
  // Add constraints if you want (types/size), e.g.:
  // const { url, id } = await generateUploadUrl({
  //   contentType: ['image/*', 'application/pdf'],
  //   maximumSize: 15_000_000,
  // })

  const { url, id } = await generateUploadUrl()
  return { url, id }
}
