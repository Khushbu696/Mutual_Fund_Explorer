import { NextResponse } from 'next/server';
import dayjs from 'dayjs';

export async function GET(request, { params }) {
    const { code } = params;
    try {
        const url = new URL(request.url);
        const period = url.searchParams.get('period');
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');

        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        const data = await res.json();
        const raw = data.data ?? [];

        // MFAPI returns latest-first; convert to array of {date, nav} with day order (latest-first)
        const navs = raw.map(r => ({ date: r.date, nav: parseFloat(r.nav) }));

        // determine endDate and startDate as dayjs
        let endDate, startDate;
        if (period) {
            // endDate = latest nav date
            endDate = dayjs(navs[0]?.date, 'DD-MM-YYYY');
            if (period === '1m') startDate = endDate.subtract(1, 'month');
            else if (period === '3m') startDate = endDate.subtract(3, 'month');
            else if (period === '6m') startDate = endDate.subtract(6, 'month');
            else if (period === '1y') startDate = endDate.subtract(1, 'year');
            else return NextResponse.json({ error: 'invalid period' }, { status: 400 });
        } else if (from && to) {
            startDate = dayjs(from, 'YYYY-MM-DD');
            endDate = dayjs(to, 'YYYY-MM-DD');
        } else {
            return NextResponse.json({ error: 'missing params' }, { status: 400 });
        }

        // find nearest earlier-or-same NAV for start and end
        const findNavOnOrBefore = (target) => {
            for (const n of navs) {
                const nd = dayjs(n.date, 'DD-MM-YYYY');
                if (nd.isSame(target) || nd.isBefore(target)) return n;
            }
            return null;
        };

        const startNavObj = findNavOnOrBefore(startDate);
        const endNavObj = findNavOnOrBefore(endDate) || navs[0] || null;

        if (!startNavObj || !endNavObj) return NextResponse.json({ needs_review: true });

        const startNAV = parseFloat(startNavObj.nav);
        const endNAV = parseFloat(endNavObj.nav);

        if (!startNAV || !endNAV) return NextResponse.json({ needs_review: true });

        const simpleReturn = ((endNAV - startNAV) / startNAV) * 100;
        const days = endDate.diff(startDate, 'day');
        const annualizedReturn = days >= 30 ? (Math.pow(endNAV / startNAV, 365 / days) - 1) * 100 : null;

        return NextResponse.json({
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            startNAV: Number(startNAV.toFixed(4)),
            endNAV: Number(endNAV.toFixed(4)),
            simpleReturn: Number(simpleReturn.toFixed(2)),
            annualizedReturn: annualizedReturn !== null ? Number(annualizedReturn.toFixed(2)) : null,
        });
    } catch (err) {
        console.error('Error returns API', err);
        return NextResponse.json({ error: 'Failed to compute returns' }, { status: 500 });
    }
}
