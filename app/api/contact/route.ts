import { NextResponse } from 'next/server';

/**
 * "Get in touch" submissions.
 * Demo: logged to the server console. Production: set CONTACT_WEBHOOK_URL to forward
 * the payload (e.g. to Salesforce Web-to-Lead via middleware, or a HubSpot form endpoint).
 */
export async function POST(req: Request) {
  const data = await req.json();
  if (!data?.email || !data?.name) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });

  const url = process.env.CONTACT_WEBHOOK_URL;
  if (url) {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, source: 'vicon-store' }) });
    if (!res.ok) return NextResponse.json({ error: 'Failed to submit' }, { status: 502 });
  } else {
    console.log('[contact] new enquiry', data);
  }
  return NextResponse.json({ ok: true });
}
