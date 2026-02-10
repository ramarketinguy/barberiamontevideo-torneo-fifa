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
    if (typeof window === 'undefined') return;

    const payload = {
        data: [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                event_source_url: window.location.href,
                user_data: {
                    client_user_agent: navigator.userAgent,
                    fbc: getCookie('_fbc') || null,
                    fbp: getCookie('_fbp') || null,
                },
                custom_data: {
                    ...customData
                }
            }
        ],
    };

    // Convert value to number if present
    if (payload.data[0].custom_data.value) {
        payload.data[0].custom_data.value = parseFloat(payload.data[0].custom_data.value);
    }

    try {
        const response = await fetch('/api/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log('Meta Event Attempt:', eventName, result);
        return result;
    } catch (error) {
        console.error('Meta Event Error:', error);
    }
};
