import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

/**
 * Generates an invoice PDF by rendering an HTML template in the browser
 * and capturing it with html2canvas. This ensures Bengali (and any complex
 * script) text is rendered perfectly using the browser's text-shaping engine.
 */
export const generateInvoicePDF = async (order: any) => {
  // ── Build invoice HTML ────────────────────────────────────────────────────
  const street =
    typeof order.deliveryAddress === 'string'
      ? JSON.parse(order.deliveryAddress).street || 'N/A'
      : order.deliveryAddress?.street || 'N/A';

  const statusColor = order.status === 'CANCELLED' ? '#DC2626' : '#059669';

  const itemRows = (order.items ?? [])
    .map((item: any) => {
      const name = item.item?.name || item.itemName || 'Unknown Item';
      const qty = item.quantity;
      const unitPrice = (item.itemPrice || item.price || 0).toFixed(2);
      const total = ((item.itemPrice || item.price || 0) * qty).toFixed(2);
      return `
        <tr>
          <td style="padding:8px 10px; font-size:13px; border-bottom:1px solid #E5E7EB; word-break:break-word;">${name}</td>
          <td style="padding:8px 10px; font-size:13px; border-bottom:1px solid #E5E7EB; text-align:center;">${qty}</td>
          <td style="padding:8px 10px; font-size:13px; border-bottom:1px solid #E5E7EB; text-align:right;">${unitPrice}</td>
          <td style="padding:8px 10px; font-size:13px; border-bottom:1px solid #E5E7EB; text-align:right;">${total}</td>
        </tr>`;
    })
    .join('');

  const discountRow =
    order.discountAmount && order.discountAmount > 0
      ? `<tr>
           <td style="padding:4px 10px; color:#6B7280; font-size:13px;">Discount</td>
           <td style="padding:4px 10px; text-align:right; font-size:13px;">-${order.discountAmount.toFixed(2)}</td>
         </tr>`
      : '';

  const deliveryText =
    (order.deliveryCharge || 0) > 0
      ? (order.deliveryCharge || 0).toFixed(2)
      : 'FREE';

  const html = `
    <div id="invoice-root" style="
      width: 794px;
      padding: 0;
      font-family: 'Noto Sans Bengali', 'Noto Sans', Arial, sans-serif;
      background: #ffffff;
      color: #111827;
      box-sizing: border-box;
    ">
      <!-- AMBER TOP STRIPE -->
      <div style="height:6px; background:#F59E0B; width:100%;"></div>

      <!-- MAIN CONTENT AREA -->
      <div style="padding: 44px 52px 40px 52px;">

        <!-- HEADER -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
          <div>
            <div style="font-size:28px; font-weight:700; color:#F59E0B; line-height:1.2; letter-spacing:-0.5px;">Lakri Chulay Ranna</div>
            <div style="font-size:12px; color:#6B7280; margin-top:5px;">Cooking with fire, served with love</div>
            <div style="font-size:12px; color:#6B7280; margin-top:1px;">Dhaka, Bangladesh</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:32px; font-weight:800; color:#1F2937; line-height:1; letter-spacing:-1px;">INVOICE</div>
            <div style="font-size:13px; color:#9CA3AF; margin-top:6px;">#${order.orderNumber}</div>
            <div style="font-size:12px; color:#9CA3AF; margin-top:2px;">${format(new Date(order.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}</div>
          </div>
        </div>

        <!-- DIVIDER -->
        <hr style="border:none; border-top:1px solid #E5E7EB; margin:0 0 20px 0;" />

        <!-- BILL TO / ORDER DETAILS -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px;">
          <div>
            <div style="font-size:10px; font-weight:700; color:#9CA3AF; letter-spacing:0.12em; margin-bottom:8px;">BILL TO</div>
            <div style="font-size:15px; font-weight:700; color:#111827;">${order.customerName || 'N/A'}</div>
            <div style="font-size:13px; color:#4B5563; margin-top:3px;">${street}</div>
            <div style="font-size:13px; color:#4B5563; margin-top:1px;">${order.customerPhone || 'N/A'}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:10px; font-weight:700; color:#9CA3AF; letter-spacing:0.12em; margin-bottom:8px;">ORDER DETAILS</div>
            <div style="font-size:13px; font-weight:700; color:${statusColor};">Status: ${order.status}</div>
            <div style="font-size:13px; color:#4B5563; margin-top:3px;">Method: ${order.paymentMethod}</div>
          </div>
        </div>

        <!-- ITEMS TABLE -->
        <table style="width:100%; border-collapse:collapse; table-layout:fixed;">
          <colgroup>
            <col style="width:auto;" />
            <col style="width:64px;" />
            <col style="width:110px;" />
            <col style="width:110px;" />
          </colgroup>
          <thead>
            <tr style="background:#1F2937; color:#ffffff;">
              <th style="padding:11px 12px; text-align:left; font-size:11px; font-weight:600; letter-spacing:0.06em;">DESCRIPTION</th>
              <th style="padding:11px 12px; text-align:center; font-size:11px; font-weight:600; letter-spacing:0.06em;">QTY</th>
              <th style="padding:11px 12px; text-align:right; font-size:11px; font-weight:600; letter-spacing:0.06em;">UNIT PRICE</th>
              <th style="padding:11px 12px; text-align:right; font-size:11px; font-weight:600; letter-spacing:0.06em;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <!-- SUMMARY -->
        <div style="display:flex; justify-content:flex-end; margin-top:16px;">
          <table style="width:284px; border-collapse:collapse;">
            <tr>
              <td style="padding:6px 12px; font-size:13px; color:#6B7280;">Subtotal</td>
              <td style="padding:6px 12px; font-size:13px; text-align:right; color:#111827;">${(order.subtotal || 0).toFixed(2)}</td>
            </tr>
            ${discountRow}
            <tr>
              <td style="padding:6px 12px; font-size:13px; color:#6B7280; border-bottom:1px solid #E5E7EB;">Delivery Charge</td>
              <td style="padding:6px 12px; font-size:13px; text-align:right; color:#111827; border-bottom:1px solid #E5E7EB;">${deliveryText}</td>
            </tr>
            <tr style="background:#1F2937; color:#ffffff;">
              <td style="padding:11px 12px; font-size:13px; font-weight:700; border-radius:0 0 0 4px;">TOTAL AMOUNT</td>
              <td style="padding:11px 12px; font-size:13px; font-weight:700; text-align:right; border-radius:0 0 4px 0;">${(order.total || 0).toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <!-- FOOTER -->
        <div style="margin-top:40px; text-align:center; font-size:12px; color:#9CA3AF; border-top:1px solid #E5E7EB; padding-top:16px;">
          Thank you for your order! — Lakri Chulay Ranna
        </div>

      </div><!-- end main content -->
    </div>
  `;

  // ── Render HTML to canvas ─────────────────────────────────────────────────
  // Inject Google Fonts for proper Bengali text shaping
  const style = document.createElement('style');
  style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap');`;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.zIndex = '-1';
  document.body.appendChild(container);

  // Wait for fonts (including Noto Sans Bengali) to fully load
  await document.fonts.ready;

  const canvas = await html2canvas(container.querySelector('#invoice-root') as HTMLElement, {
    scale: 2,           // 2× for crisp high-DPI rendering
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc) => {
      // html2canvas parses ALL page CSS when it clones the document.
      // Modern CSS color functions like lab() and oklch() (used by Tailwind/global CSS)
      // are not supported by html2canvas v1.x and will throw.
      // Our invoice uses only inline styles, so it's safe to strip all external CSS.
      clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.remove());
      clonedDoc.querySelectorAll('style').forEach(el => {
        // Keep only the Noto Sans Bengali Google Fonts import we injected
        if (!el.textContent?.includes('Noto+Sans+Bengali')) {
          el.remove();
        }
      });
    },
  });

  // Clean up injected DOM nodes
  document.body.removeChild(container);
  document.head.removeChild(style);

  // ── Add canvas image to PDF ───────────────────────────────────────────────
  const imgData = canvas.toDataURL('image/png');
  const imgW = 210;                         // A4 width mm
  const imgH = (canvas.height / canvas.width) * imgW;

  // Use a custom page size if the invoice is taller than A4, otherwise standard A4
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: imgH > 297 ? [imgW, imgH] : 'a4',
  });

  doc.addImage(imgData, 'PNG', 0, 0, imgW, imgH);
  doc.save(`invoice-${order.orderNumber}.pdf`);
};
