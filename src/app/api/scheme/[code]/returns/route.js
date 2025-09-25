import { NextResponse } from 'next/server';
import axios from 'axios';
import dayjs from 'dayjs';

export async function GET(req, { params, url }) {
    const { code } = params;
    const searchParams = new URL(url).searchParams;
    const period = searchParams.get('period');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    try {
        const { data } = await axios.get(`https://api.mfapi.in/mf/${code}`);
        const navs = data.data.reverse();

        let startDate, endDate;

        if (period) {
            endDate = dayjs();
            if (period === '1m') startDate = endDate.subtract(1, 'month');
            else if (period === '3m') startDate = endDate.subtract(3, 'month');
            else if (period === '6m') startDate = endDate.subtract(6, 'month');
            else if (period === '1y') startDate = endDate.subtract(1, 'year');
        } else if (from && to) {
            startDate = dayjs(from);
            endDate = dayjs(to);
        }

        const startNavObj = navs.find(n => dayjs(n.date, 'DD-MM-YYYY').isAfter(startDate) || dayjs(n.date, 'DD-MM-YYYY').isSame(startDate));
        const endNavObj = navs.find(n => dayjs(n.date, 'DD-MM-YYYY').isAfter(endDate) || dayjs(n.date, 'DD-MM-YYYY').isSame(endDate)) || navs[navs.length - 1];

        if (!startNavObj || !endNavObj) return NextResponse.json({ needs_review: true });

        const startNAV = parseFloat(startNavObj.nav);
        const endNAV = parseFloat(endNavObj.nav);
        const simpleReturn = ((endNAV - startNAV) / startNAV) * 100;
        const years = endDate.diff(startDate, 'day') / 365;
        const annualizedReturn = years >= 0.082 ? (Math.pow(endNAV / startNAV, 1 / years) - 1) * 100 : null;

        return NextResponse.json({
            startDate: startNavObj.date,
            endDate: endNavObj.date,
            startNAV,
            endNAV,
            simpleReturn: simpleReturn.toFixed(2),
            annualizedReturn: annualizedReturn ? annualizedReturn.toFixed(2) : null,
        });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to calculate returns' }, { status: 500 });
    }
}
