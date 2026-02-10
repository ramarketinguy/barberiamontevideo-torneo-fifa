/**
 * Helper to get a cookie value
 */
const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

/**
 * Utility to send events to Meta Conversions API (CAPI) via secure API proxy
 */
export const sendMetaEvent = async (eventName: string, customData: any = {}) => {
    // Basic payload structure based on Meta Conversions API requirements
    const payload = {
        data: [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                event_source_url: typeof window !== 'undefined' ? window.location.href : '',
                user_data: {
                    client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                    fbc: getCookie('_fbc'),
                    fbp: getCookie('_fbp'),
                },
                custom_data: {
                    currency: "UYU",
                    ...customData
                }
            }
        ],
        test_event_code: "TEST70646" // Keep this while testing
    };

    try {
        const response = await fetch('/api/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.error) {
            console.error('Meta Proxy Error:', result.error);
        } else {
            console.log('Meta Event Sent Successfully via Proxy:', eventName, result);
        }
        return result;
    } catch (error) {
        console.error('Error calling Meta Proxy:', error);
    }
};
