export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const body = await req.json();
        const accessToken = process.env.VITE_META_ACCESS_TOKEN;
        const pixelId = process.env.VITE_META_PIXEL_ID;

        if (!accessToken || !pixelId) {
            return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 500 });
        }

        // Forward to Meta
        const response = await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const result = await response.json();
        return new Response(JSON.stringify(result), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
