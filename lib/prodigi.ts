export interface ProdigiOrderRequest {
    recipient: {
        name: string;
        email?: string;
        phoneNumber?: string;
        address: {
            line1: string;
            line2?: string;
            townOrCity: string;
            stateOrCounty?: string;
            postalOrZipCode: string;
            countryCode: string;
        };
    };
    items: Array<{
        sku: string;
        quantity: number;
        assets: Array<{
            printArea: string;
            url: string;
        }>;
    }>;
    shippingMethod?: string;
}

export async function createProdigiOrder(orderData: ProdigiOrderRequest) {
    const apiKey = process.env.PRODIGI_API_KEY;
    if (!apiKey) {
        throw new Error('PRODIGI_API_KEY is not defined in environment variables');
    }

    const response = await fetch('https://api.prodigi.com/v4.0/Orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
        },
        body: JSON.stringify({
            ...orderData,
            shippingMethod: orderData.shippingMethod || 'Budget',
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Prodigi API error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
}
