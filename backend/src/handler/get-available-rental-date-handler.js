'use strict';

import { getProductUnavailability } from '../service/get-available-rental-date-service';

export const handler = async (event, context) => {
    const { productVariantId } = event.queryStringParameters;
    try {
        const unavailableDates = getProductUnavailability(productVariantId);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ unavailableDates }),
        };
    } catch (err) {
        console.error(err);

        return {
            statusCode: err.code || 404,
            body: JSON.stringify({ message: err.message }),
        };
    }
};
