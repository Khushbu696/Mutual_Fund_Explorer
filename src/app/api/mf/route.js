import { NextResponse } from 'next/server';
import axios from 'axios';
import { getCache, setCache } from '../../../utils/cache';

export async function GET() {
    const cached = getCache('mf_list');
    if (cached) return NextResponse.json(cached);

    try {
        const { data } = await axios.get('https://api.mfapi.in/mf');
        setCache('mf_list', data, 12 * 3600);
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch MF list' }, { status: 500 });
    }
}
