export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    // Manejo de CORS manual para asegurar que la web pueda hablar con la API
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
    }

    try {
        const body = await req.json();
        const accessToken = process.env.META_ACCESS_TOKEN;
        const pixelId = process.env.META_PIXEL_ID;

        if (!accessToken || !pixelId) {
            return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 500, headers });
        }

        // Get client IP from Vercel headers
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip');

        // Infuse the payload with server-side metadata
        if (body.data && body.data[0]) {
            if (!body.data[0].user_data) body.data[0].user_data = {};
            if (clientIp) body.data[0].user_data.client_ip_address = clientIp;
        }

        const response = await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const result = await response.json();

        return new Response(JSON.stringify(result), {
            status: response.status,
            headers,
        });
    } catch (error) {
        console.error('CAPI Proxy Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Error', details: String(error) }), { status: 500, headers });
    }
}
