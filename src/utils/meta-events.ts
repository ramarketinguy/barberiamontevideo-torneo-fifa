/**
 * Helper to get a cookie value
 */
const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

/**
 * Utility to send events to Meta Conversions API (CAPI)
 */
export const sendMetaEvent = async (eventName: string, customData: any = {}) => {
    const accessToken = import.meta.env.VITE_META_ACCESS_TOKEN;
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;

    if (!accessToken || !pixelId || pixelId === 'YOUR_PIXEL_ID_HERE') {
        console.warn('Meta credentials missing or using placeholder (VITE_META_PIXEL_ID)');
        return;
    }

    // Basic payload structure based on Meta Conversions API requirements
    const payload = {
        data: [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                event_source_url: window.location.href,
                user_data: {
                    client_user_agent: navigator.userAgent,
                    fbc: getCookie('_fbc'),
                    fbp: getCookie('_fbp'),
                },
                custom_data: {
                    currency: "USD",
                    ...customData
                },
                test_event_code: "TEST70646"
            }
        ]
    };

    try {
        const response = await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.error) {
            console.error('Meta CAPI Error:', result.error);
        } else {
            console.log('Meta CAPI Event Sent:', eventName, result);
        }
        return result;
    } catch (error) {
        console.error('Error sending Meta CAPI event:', error);
    }
};
