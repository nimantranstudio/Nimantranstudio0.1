/**
 * Seller details as registered on the GST certificate (Form GST REG-06).
 * Not currently printed on the receipt (kept simple, no GST breakup for now)
 * — held here so a future switch back to a formal tax invoice doesn't need
 * these collected again.
 */
export const BUSINESS_INFO = {
    legalName: 'Priyanka Bhagwan Dhage',
    tradeName: 'Nimantran Studio',
    gstin: '27CNRPD7986C1ZH',
    addressLines: [
        'B4-2104, Purva Silversands, Keshav Nagar Road',
        'Keshavnagar Mundwa, Pune, Maharashtra 411036',
    ],
    state: 'Maharashtra',
    stateCode: '27',
} as const;
