const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://postmd.vercel.app'

export function GET() {
  return new Response(
    [
      `Contact: ${siteUrl}/privacy`,
      `Policy: ${siteUrl}/privacy`,
      'Preferred-Languages: ru,en',
      '',
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  )
}
