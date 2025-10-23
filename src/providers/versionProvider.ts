import * as https from 'https'

type CacheEntry = { sha?: string; ts: number }

const CACHE_TTL = 1000 * 60 * 5 // 5 minutes
const cache: Record<string, CacheEntry> = {}

const pathToGithub = (repoPath: string): string =>
  `https://api.github.com/repos/mdn/content/commits?path=${encodeURIComponent(repoPath)}&per_page=1`

const parseShaFromBody = (body: string): string | undefined => {
  const parsed = JSON.parse(body)
  return Array.isArray(parsed) && parsed.length > 0 && parsed[0].sha ?
    parsed[0].sha as string :
    undefined
}

const fetchUrl = (url: string): Promise<{ status?: number; body: string } | undefined> =>
  new Promise(resolve => {
    const opts: https.RequestOptions = {
      headers: { 'User-Agent': 'mdn-macros-syntax', 'Accept': 'application/vnd.github.v3+json' }
    }
    const req = https.get(url, opts, res => {
      let body = ''
      res.on('data', d => (body += d))
      res.on('end', () => resolve({ status: res.statusCode, body }))
    })
    req.on('error', () => resolve(undefined))
    req.end()
  })

export const getLatestShaForRepoPath = async (repoPath: string): Promise<string | undefined> => {
  const now = Date.now()
  const cached = cache[repoPath]
  if (cached && now - cached.ts < CACHE_TTL) return cached.sha

  const url = pathToGithub(repoPath)
  const res = await fetchUrl(url)
  const sha = res && res.status && res.status >= 200 && res.status < 300 ? parseShaFromBody(res.body) : undefined

  cache[repoPath] = { sha, ts: now }
  return sha
}
