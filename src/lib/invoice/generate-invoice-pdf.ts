import PDFDocument from 'pdfkit';
import { BUSINESS_INFO } from './business-info';

export interface InvoicePdfData {
    invoiceNumber: string;
    invoiceDate: Date;
    orderId: string;
    razorpayPaymentId: string | null;
    paymentMethod: string | null;
    billTo: {
        phone?: string | null;
    };
    itemDescription: string;
    totalAmount: number;
}

const INK = '#2A2417';
const MUTED = '#6B6353';
const RULE = '#E4DCC6';

/** A simple payment receipt — company name, receipt ref, who paid, what for, and the amount. */
export async function generateInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
    const doc = new PDFDocument({ size: 'A4', margin: 42 });
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));
    const done = new Promise<Buffer>((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const left = doc.page.margins.left;

    // Header
    doc.font('Helvetica-Bold').fontSize(22).fillColor(INK).text(BUSINESS_INFO.tradeName, left, 48);
    doc.font('Helvetica').fontSize(11).fillColor(MUTED).text('Payment Receipt', left, doc.y + 2);

    let y = doc.y + 24;
    doc.moveTo(left, y).lineTo(left + pageWidth, y).strokeColor(RULE).stroke();
    y += 22;

    const row = (label: string, value: string) => {
        doc.font('Helvetica').fontSize(9.5).fillColor(MUTED).text(label, left, y, { width: 140 });
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor(INK).text(value, left + 140, y, { width: pageWidth - 140 });
        y = doc.y + 10;
    };

    row('Receipt No.', data.invoiceNumber);
    row('Date', data.invoiceDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
    if (data.billTo.phone) row('Billed To', `+91 ${data.billTo.phone}`);
    row('Description', data.itemDescription);
    if (data.paymentMethod) row('Payment Method', data.paymentMethod.toUpperCase());
    if (data.razorpayPaymentId) row('Payment Ref.', data.razorpayPaymentId);

    y += 12;
    doc.moveTo(left, y).lineTo(left + pageWidth, y).strokeColor(RULE).stroke();
    y += 24;

    doc.font('Helvetica').fontSize(10).fillColor(MUTED).text('Total Amount Paid', left, y);
    doc.font('Helvetica-Bold').fontSize(26).fillColor(INK).text(`INR ${data.totalAmount.toFixed(2)}`, left, y + 16);

    // Footer
    const footerY = doc.page.height - doc.page.margins.bottom - 40;
    doc.moveTo(left, footerY).lineTo(left + pageWidth, footerY).strokeColor(RULE).stroke();
    doc.font('Helvetica').fontSize(8).fillColor(MUTED).text(
        'Thank you for choosing Nimantran Studio.',
        left,
        footerY + 10,
        { width: pageWidth, align: 'center' }
    );

    doc.end();
    return done;
}
