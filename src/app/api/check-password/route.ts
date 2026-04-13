import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'NextJS-HIBP-Check'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch from HIBP API', response.statusText);
      return NextResponse.json({ error: 'Failed to check password' }, { status: 502 });
    }

    const data = await response.text();
    const leakedList = data.split('\r\n');

    let isLeaked = false;
    let count = 0;

    for (const line of leakedList) {
      if (line.includes(':')) {
        const [leakedSuffix, leakCount] = line.split(':');
        if (leakedSuffix === suffix) {
          isLeaked = true;
          count = parseInt(leakCount, 10);
          break;
        }
      }
    }

    return NextResponse.json({ isLeaked, count });
  } catch (error) {
    console.error('Password check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
