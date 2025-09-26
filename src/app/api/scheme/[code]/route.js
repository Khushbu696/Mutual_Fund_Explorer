import { NextResponse } from 'next/server';
import axios from 'axios';

let navCache = {};

export async function GET(req, { params }) {
    const { code } = params;

    if (navCache[code]) {
        return NextResponse.json(navCache[code]);
    }

    try {
        const res = await axios.get(`https://api.mfapi.in/mf/${code}`);
        const data = res.data;

        // only keep plain JSON: metadata + data
        const response = {
            meta: data.meta,
            data: data.data.map(n => ({ date: n.date, nav: parseFloat(n.nav) }))
        };

        navCache[code] = response;
        return NextResponse.json(response);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch scheme' }, { status: 500 });
    }
}
