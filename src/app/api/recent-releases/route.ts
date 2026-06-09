import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function fetchGet(url: string) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const https = require('https');
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://ticketing.theconnplex.com',
        'Referer': 'https://ticketing.theconnplex.com/',
        'X-Device-Type': 'web',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      }
    };

    https.get(options, (res: any) => {
      let data = '';
      res.on('data', (chunk: string) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

export async function GET() {
  try {
    // 1. Fetch cinemas to get regions and resolve Ahmedabad ID
    const res = await fetchGet('https://backend.theconnplex.com/api/get-cinema') as any;
    let ahmedabadId = '64da17939cdcb529a693aac2'; // Default fallback ID for Ahmedabad

    if (res && res.data && Array.isArray(res.data)) {
      const found = res.data.find((c: any) => c.regionId && c.regionId.region && c.regionId.region.toLowerCase().includes('ahmedabad'));
      if (found && found.regionId) {
        ahmedabadId = found.regionId._id;
      }
    }

    // 2. Fetch recent releases for resolved region ID
    const moviesRes = await fetchGet(`https://backend.theconnplex.com/api/user/get-recent-releases-movie-by-region/${ahmedabadId}`) as any;

    if (moviesRes && moviesRes.status === 200 && moviesRes.data && Array.isArray(moviesRes.data.recentReleasesMovies)) {
      const list = moviesRes.data.recentReleasesMovies;
      const formatted = list.map((m: any) => {
        // format category to look like "Action • Adventure" instead of "Action ,Adventure"
        const category = m.category ? m.category.split(',').map((s: string) => s.trim()).filter(Boolean).join(' • ') : '';
        
        let displayName = m.name || '';
        // Clean up text like (HINDI), (ENG) from the end of the name
        displayName = displayName.replace(/\s*\((HINDI|ENGLISH|TELUGU|TAMIL|KANNADA|MALAYALAM|GUJARATI|BENGALI|MARATHI)\)\s*$/i, '');

        return {
          src: `https://d1b2pdd8bvo7rr.cloudfront.net/uploads/${m.poster}`,
          alt: displayName,
          title: displayName,
          genre: category || 'Drama',
          rating: m.rating ? String(m.rating) : '4.8'
        };
      });

      return NextResponse.json({ success: true, movies: formatted });
    }

    throw new Error('Invalid API response format');
  } catch (err: any) {
    console.error('Failed to fetch dynamic recent releases:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
