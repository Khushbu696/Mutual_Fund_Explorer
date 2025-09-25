import { NextResponse } from 'next/server';
import axios from 'axios';
import { getCache, setCache } from '../../../utils/cache';

export async function GET(req, { params }) {
    const { code } = params;
    const cached = getCache(`scheme_${code}`);
    if (cached) return NextResponse.json(cached);

    try {
        const { data } = await axios.get(`https://api.mfapi.in/mf/${code}`);
        setCache(`scheme_${code}`, data, 12 * 3600);
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch scheme details' }, { status: 500 });
    }
}
