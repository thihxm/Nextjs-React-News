import { createClient, getEndpoint, HttpRequestLike } from '@prismicio/client'

export const repositoryName = `${process.env.PRISMIC_REPOSITORY_NAME}`
const apiEndpoint = getEndpoint(repositoryName)

const accessToken = `${process.env.PRISMIC_ACCESS_TOKEN}`

export const PrismicClient = (req?: HttpRequestLike) => {
  const client = createClient(apiEndpoint, {
    accessToken,
  })

  if (req) {
    client.enableAutoPreviewsFromReq(req)
  }

  return client
}
