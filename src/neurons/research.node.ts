/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import axios from 'axios'
import { type AICursor, type AI } from '../ai.js'
interface QueryResultPageMap {
  'cse_thumbnail': Array<{
    'src': string
    'width': string
    'height': string
  }>
  'metatags': Array<{
    'msapplication-tilecolor': `#${string}`
    'og:image': 'https://merriam-webster.com/assets/mw/static/social-media-share/mw-logo-245x245@1x.png'
    'twitter:title': 'Definition of NAME'
    'twitter:card': 'summary'
    'theme-color': `#${string}`
    'twitter:url': 'https://www.merriam-webster.com/dictionary/name'
    'og:title': 'Definition of NAME'
    'twitter:aria-text': 'Share the Definition of name on Twitter'
    'og:aria-text': 'Post the Definition of name to Facebook'
    'og:description': 'a word or phrase that constitutes the distinctive designation of a person or thing; a word or symbol used in logic to designate an entity; a descriptive often disparaging epithet… See the full definition'
    'twitter:image': 'https://merriam-webster.com/assets/mw/static/social-media-share/mw-logo-245x245@1x.png'
    'referrer': 'unsafe-url'
    'fb:app_id': '178450008855735'
    'twitter:site': '@MerriamWebster'
    'viewport': 'width=device-width, initial-scale=1.0'
    'twitter:description': 'a word or phrase that constitutes the distinctive designation of a person or thing; a word or symbol used in logic to designate an entity… See the full definition'
    'og:url': 'https://www.merriam-webster.com/dictionary/name'
  }>
  'cse_image': Array<
  {
    'src': 'https://merriam-webster.com/assets/mw/static/social-media-share/mw-logo-245x245@1x.png'
  }
  >
}
interface QueryResult {
  'kind': 'customsearch#result'
  'title': string
  'htmlTitle': string
  'link': `https://${string}` | `http://${string}`
  'displayLink': string
  'snippet': string
  'htmlSnippet': string
  'cacheId': string
  'formattedUrl': `https://${string}` | `http://${string}`
  'htmlFormattedUrl': `https://${string}` | `http://${string}`
  'pagemap': QueryResultPageMap
}
const findFromGoogle = async (query: string) => {
  const variable = query?.toLowerCase()
  if (query===undefined || query === null || query === '') {
    return []
  }
  const result = await axios.get((process.env.GOOL as string).concat(`&q=${query}`)).then(async (r) => r.data).catch(() => ({ items: [] })) as { items: QueryResult[] }
  return result.items.filter((item: QueryResult) => {
    const title = item.title.toLowerCase()
    const snippet = item.snippet.toLowerCase()
    // console.log('findFromGoogle', title, 'variable=', variable)
    if (title.includes(`definition of ${variable}`)) {
      return true
    }
    if (title.includes(`${variable} definition`)) {
      return true
    }
    if (title.includes('nary') && title.includes(`${variable}`)) {
      return true
    }
    if (title.includes('definition') && title.includes(`${variable}`)) {
      return true
    }
    if (snippet.includes(`${variable}, is`) && snippet.includes(`${variable} is`)) {
      return true
    }
    return false
  })
}
const prepareMostAppropriateResult = async (query: string, result: QueryResult[][]) => {

}
const prepareResult = (cursor: AICursor<ResearchInput, ResearchOutput, any>, input: ResearchInput, query: string, results: QueryResult[]) => {
  if (results.length === 0) {
    return results
  }
  cursor.result<ResearchOutput>({ id: input.id, data: Buffer.from('does it mean') })
  results.forEach((result) => {
    cursor.result({ id: input.id, data: Buffer.from(result.snippet) })
  })
  return results
}
export interface ResearchInput {
  id: string
  type: 'text'
  data: Buffer
}

export interface ResearchOutput {
  id: string
  data: Buffer
}
export const researchNode = (ai: AI) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  ai.on('research', async (input: ResearchInput) => {
    const cursor = ai.cursor('research', input.id)
    const variable = input.data.toString('utf8')
   
    cursor.result<ResearchOutput>({ id: input.id, data: Buffer.from(`Sorry am not sure i understand what ${variable} means`) })
    const results = await findFromGoogle(variable)
      .then((result) => prepareResult(cursor, input, variable, result))
    await prepareMostAppropriateResult(variable, [results])
    cursor.end()
  })
}
