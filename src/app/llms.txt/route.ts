const body = `# PostMD

PostMD is a Markdown paste service for publishing, sharing, editing, and viewing Markdown entries.

## Public URLs

- /: create a Markdown entry.
- /privacy: privacy policy.
- /robots.txt: crawler policy.
- /sitemap.xml: public sitemap.

## Entry URLs

- /{id}: rendered Markdown entry.
- /{id}/raw: raw Markdown entry content.
- /{id}/edit: edit an existing entry with owner access or an edit code.

## Notes for agents

Respect robots.txt, avoid submitting forms without user intent, and treat entry edit codes as secrets.
`

export function GET() {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
