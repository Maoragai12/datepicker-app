'use strict';

import db from '../../datepicker-exercise-mock-db.json';

/**
 * Returns array of inventory item ids of specific product variant.
 * @param {string} productVariantId
 * @returns {string[]}
 */
function getInventoryItemIds(productVariantId) {

    return db.InventoryItems.reduce((inventoryItemIds, inventoryItem) => {

        if (inventoryItem.ProductVariantId === productVariantId) {
            return [ ...inventoryItemIds, inventoryItem.InventoryItemId ];
        }

        return inventoryItemIds;
    }, []);
}

/**
 * Returns array of unavailable dates for specific variant by his inventory item ids.
 * @param {string[]} inventoryItemIds
 * @returns {Record<string, number>[]}
 */
function getTotalUnavailableDateRangesForVariant(inventoryItemIds) {

    return db.OrderLines.reduce((unavailableDates, order) => {

        if (inventoryItemIds.includes(order.InventoryItemId)) {
            const startDateInMs = new Date(order.StartDate).getTime();
            const endDateInMs = new Date(order.StartDate).getTime()  + (order.RentalPeriodDays * 8.64e+7);

            const unavailableDate = {
                startDateInMs,
                endDateInMs,
            };

            return [ ...unavailableDates, unavailableDate ];
        }

        return unavailableDates;
    }, []);
}

/**
 * Checks if there is a variant with other inventory item id that available
 * in the same date and returns a new array.
 * @param {Record<string, number>[]} unavailableDates
 * @param {number} numOfInventoryItems
 * @returns {Record<string, number>[]}
 */
function filterVariantAvailabilityInSameDateRange(unavailableDates, numOfInventoryItems) {

    const filterdUnavailableDates = [];

    unavailableDates.forEach(unavailableDate => {

        const { startDateInMs, endDateInMs } = unavailableDate;

        const sameUnavailableDates = unavailableDates.filter(unavailableDate =>
            unavailableDate.startDateInMs === startDateInMs && unavailableDate.endDateInMs === endDateInMs);

        if (sameUnavailableDates.length === numOfInventoryItems) {
            const isUnavailableDateExists = filterdUnavailableDates.some(unavailableDate =>
                unavailableDate.startDateInMs === startDateInMs && unavailableDate.endDateInMs === endDateInMs);

            !isUnavailableDateExists ? filterdUnavailableDates.push(unavailableDate) : null;
        }
    });

    return filterdUnavailableDates;
}

/**
 * Checks if unavailable date is between other date ranges.
 * @param {Record<string, number>[]} unavailableDates
 * @param {number} unavailableDate
 * @returns {boolean}
 */
function isUnavailableDateBetweenDateRanges(unavailableDates, unavailableDate) {

    const dateOverlaps = unavailableDates.filter(date =>
        date.startDateInMs <= unavailableDate.startDateInMs && date.endDateInMs > unavailableDate.endDateInMs);

    return dateOverlaps.length > 1;
}

/**
 * Checks date ranges overlap and returns a new updated array.
 * @param {Record<string, number>[]} unavailableDates
 * @returns {Record<string, number>[]}
 */
function filterDateRangesOverlap(unavailableDates) {

    const filterdUnavailableDates = [];

    unavailableDates.forEach(unavailableDate => {
        const isDateOverlap = isUnavailableDateBetweenDateRanges(unavailableDates, unavailableDate);
        if (isDateOverlap) {
            filterdUnavailableDates.push(unavailableDate);
        }
    });

    return filterdUnavailableDates;
}

/**
 * Returns unavailable dates list.
 * @param {Record<string, number>[]} unavailableDates
 * @returns {number[]}
 */
function getDatesList(unavailableDates) {

    const dates = [];

    unavailableDates.forEach(unavailableDate => {
        // eslint-disable-next-line prefer-const
        let { startDateInMs, endDateInMs } = unavailableDate;
        while (startDateInMs <= endDateInMs) {
            !dates.includes(startDateInMs) ? dates.push(startDateInMs) : null;
            startDateInMs += 8.64e+7;
        }
    });

    return dates;
}

/**
 * Returns unavailable dates for specific product variant.
 * @param {string} productVariantId
 * @returns {Record<string, number>[]}
 */
export function getProductUnavailability(productVariantId) {

    const inventoryItemIds = getInventoryItemIds(productVariantId);
    if (!inventoryItemIds.length) {
        throw new Error('Product variant id does not exists');
    }

    let unavailableDates = getTotalUnavailableDateRangesForVariant(inventoryItemIds);

    const inventoryItemIdsCount = inventoryItemIds.length;
    const unavailableDatesCount = unavailableDates.length;
    if (unavailableDatesCount === 0) {
        return [];
    } else if (inventoryItemIdsCount === 1 && unavailableDatesCount > 0) {
        return getDatesList(unavailableDates);
    }

    unavailableDates = filterDateRangesOverlap(unavailableDates);
    if (unavailableDates.length >= inventoryItemIdsCount) {
        unavailableDates = filterVariantAvailabilityInSameDateRange(unavailableDates, inventoryItemIdsCount);
    }

    return getDatesList(unavailableDates);
}
