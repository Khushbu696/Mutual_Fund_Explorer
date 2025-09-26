import { NextResponse } from 'next/server';
import axios from 'axios';

let cache = null;
let cacheTime = null;

export async function GET() {
    const now = Date.now();
    if (cache && cacheTime && now - cacheTime < 1000 * 60 * 60 * 12) { // 12h cache
        return NextResponse.json(cache);
    }

    try {
        const res = await axios.get('https://api.mfapi.in/mf');
        cache = res.data; // plain JSON
        cacheTime = now;
        return NextResponse.json(cache);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
    }
}
