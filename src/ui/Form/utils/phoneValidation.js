import { isValidPhoneNumber, parsePhoneNumber, AsYouType } from 'libphonenumber-js';

/**
 * Validates a phone number strictly for US.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
    if (!phone) return false;
    try {
        const phoneNumber = parsePhoneNumber(phone, 'US');
        return phoneNumber.isValid() && phoneNumber.country === 'US';
    } catch (error) {
        return false;
    }
};

/**
 * Formats a phone number as-you-type for US.
 * @param {string} value - The input value.
 * @returns {string}
 */
export const formatAsYouType = (value) => {
    const asYouType = new AsYouType('US');
    return asYouType.input(value);
};

/**
 * Parses a phone number strictly for US.
 * @param {string} phone - The phone number.
 * @returns {object|null}
 */
export const getPhoneDetails = (phone) => {
    try {
        const phoneNumber = parsePhoneNumber(phone, 'US');
        if (phoneNumber.country !== 'US') return null;
        return {
            isValid: phoneNumber.isValid(),
            country: phoneNumber.country,
            nationalNumber: phoneNumber.nationalNumber,
            internationalNumber: phoneNumber.formatInternational(),
            e164: phoneNumber.format('E.164')
        };
    } catch (error) {
        return null;
    }
};

