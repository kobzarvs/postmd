import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PostMD - Markdown Paste Service',
    short_name: 'PostMD',
    description: 'Простой сервис для публикации постов в формате Markdown',
    start_url: '/',
    display: 'minimal-ui',
    background_color: '#f9fafb',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
    ],
  }
}
