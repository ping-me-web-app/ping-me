"use client";

import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useUserData } from "@/lib/useUserData";
import { Download, CheckCircle2, ShieldCheck } from "lucide-react";

interface StripePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StripePortalModal({ isOpen, onClose }: StripePortalModalProps) {
  const intl = useIntl();
  const { data } = useUserData();
  const [actionDone, setActionDone] = useState<string | null>(null);

  const years = data.durationYears || 2;
  const createdDate = data.createdAt ? new Date(data.createdAt) : new Date();
  const expiryDate = data.expiresAt
    ? new Date(data.expiresAt)
    : (() => {
        const d = new Date(createdDate);
        d.setFullYear(d.getFullYear() + years);
        return d;
      })();

  const renewalFormatted = expiryDate.toLocaleDateString(
    intl.locale === "nl" ? "nl-NL" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const createdFormatted = createdDate.toLocaleDateString(
    intl.locale === "nl" ? "nl-NL" : "en-US",
    { day: "numeric", month: "short", year: "numeric" }
  );

  const priceMap: Record<number, string> = { 1: "€10.00", 2: "€15.99", 3: "€20.99" };
  const currentPrice = priceMap[years] || "€15.99";

  const paymentDisplay =
    data.paymentMethod === "ideal"
      ? `iDEAL (${data.selectedBank || "Bank"})`
      : data.paymentMethod === "apple_pay"
      ? "Apple Pay"
      : "Creditcard";

  const invoiceNumber = `INV-${createdDate.getFullYear()}-${
    data.token.replace(/\D/g, "") || "8924"
  }`;

  const handleDownloadInvoice = () => {
    const numericPrice = parseFloat(currentPrice.replace(/[^0-9.]/g, "")) || 15.99;
    const subtotal = (numericPrice / 1.21).toFixed(2);
    const vat = (numericPrice - parseFloat(subtotal)).toFixed(2);

    const invoiceHtml = `<!DOCTYPE html>
<html lang="${intl.locale}">
<head>
  <meta charset="utf-8" />
  <title>Factuur / Invoice ${invoiceNumber} - Ping-Me</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 40px;
      background: #ffffff;
      font-size: 14px;
      line-height: 1.5;
    }
    .container {
      max-width: 720px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 28px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: #059669;
      margin: 0 0 4px 0;
    }
    .company-meta {
      color: #64748b;
      font-size: 12px;
      line-height: 1.45;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-title {
      font-size: 22px;
      font-weight: 800;
      margin: 0 0 6px 0;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-paid {
      display: inline-block;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      font-weight: 700;
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    .info-block h4 {
      margin: 0 0 6px 0;
      font-size: 11px;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .info-block p {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      text-align: left;
      padding: 10px 12px;
      background: #f1f5f9;
      font-size: 12px;
      text-transform: uppercase;
      color: #475569;
      font-weight: 700;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px;
    }
    .totals {
      width: 290px;
      margin-left: auto;
      margin-bottom: 30px;
    }
    .totals table td {
      padding: 6px 0;
      border: none;
    }
    .totals table tr.total-row td {
      font-weight: 800;
      font-size: 16px;
      border-top: 2px solid #0f172a;
      padding-top: 10px;
      color: #0f172a;
    }
    .footer-note {
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand-title">Ping-Me</div>
        <div class="company-meta">
          Ping-Me B.V.<br />
          Keizersgracht 482, 1016 GD Amsterdam<br />
          KvK: 92837194 • BTW-ID: NL928371940B01<br />
          support@ping-me.nl • www.ping-me.nl
        </div>
      </div>
      <div class="invoice-meta">
        <div class="invoice-title">Factuur / Invoice</div>
        <div style="font-weight: 600; color: #475569; margin-bottom: 6px;">${invoiceNumber}</div>
        <span class="badge-paid">Voldaan • Paid</span>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-block">
        <h4>Factuurgegevens / Details</h4>
        <p>Factuurdatum: ${createdFormatted}</p>
        <p>Betaalmethode: ${paymentDisplay}</p>
        <p>Status: Succesvol voldaan</p>
      </div>
      <div class="info-block">
        <h4>Voertuig & Klant / Customer</h4>
        <p>Kenteken: ${data.plate || "N/A"}</p>
        ${data.make ? `<p>Voertuig: ${data.make} ${data.model || ""}</p>` : ""}
        <p>E-mail: ${data.email || "Klant"}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Omschrijving</th>
          <th style="text-align: center;">Aantal</th>
          <th style="text-align: right;">Prijs (Excl. BTW)</th>
          <th style="text-align: right;">BTW</th>
          <th style="text-align: right;">Totaal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Ping-Me Notificatie Pas (${years} Jaar)</strong><br />
            <span style="color: #64748b; font-size: 11px;">Geldig tot ${renewalFormatted} • Onbeperkt meldingen via WhatsApp, SMS & E-mail</span>
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">€${subtotal}</td>
          <td style="text-align: right;">21%</td>
          <td style="text-align: right;">€${subtotal}</td>
        </tr>
        <tr>
          <td>
            <strong>Ping-Me Slimme QR-Sticker</strong><br />
            <span style="color: #64748b; font-size: 11px;">Statische raamfolie voor binnenzijde voorruit (Token: ${data.token || "PM-NL"})</span>
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">€0.00</td>
          <td style="text-align: right;">0%</td>
          <td style="text-align: right;">Inbegrepen</td>
        </tr>
        <tr>
          <td>
            <strong>PostNL Brievenbusbezorging</strong><br />
            <span style="color: #64748b; font-size: 11px;">Brievenbuspakje met Track & Trace</span>
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">€0.00</td>
          <td style="text-align: right;">0%</td>
          <td style="text-align: right;">Inbegrepen</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <table style="width: 100%;">
        <tr>
          <td style="color: #64748b;">Subtotaal (excl. BTW):</td>
          <td style="text-align: right;">€${subtotal}</td>
        </tr>
        <tr>
          <td style="color: #64748b;">21% BTW (Nederland):</td>
          <td style="text-align: right;">€${vat}</td>
        </tr>
        <tr class="total-row">
          <td>Totaal voldaan:</td>
          <td style="text-align: right;">€${numericPrice.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <div class="footer-note">
      Hartelijk dank voor je bestelling bij Ping-Me.<br />
      Dit document geldt als officieel betalingsbewijs met 21% Nederlandse BTW voor je boekhouding.
    </div>
  </div>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    } else {
      // Fallback: download as .html file if popup was blocked
      const blob = new Blob([invoiceHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Factuur-${invoiceNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setActionDone(
      intl.formatMessage({ id: "modals.invoiceSuccess" }, { number: invoiceNumber })
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={intl.formatMessage({ id: "modals.stripeTitle" })}
      description={intl.formatMessage({ id: "modals.stripeDesc" })}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Stripe branding badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#635BFF] text-base tracking-tighter">stripe</span>
            <span className="text-slate-600 dark:text-slate-300">
              <FormattedMessage id="modals.stripeBadge" />
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <FormattedMessage id="modals.encrypt" />
          </span>
        </div>

        {actionDone && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{actionDone}</span>
          </div>
        )}

        {/* Current plan status */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
              {years} {intl.locale === "nl" ? "Jaar Pas" : "Year Pass"}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <FormattedMessage id="modals.activeSubBadge" />
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <FormattedMessage
              id="modals.activeSubDesc"
              values={{ date: renewalFormatted, method: paymentDisplay }}
            />
          </p>
        </div>

        {/* Invoices list */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            <FormattedMessage id="modals.invoicesTitle" />
          </h4>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  <FormattedMessage id="modals.invName" values={{ number: invoiceNumber }} />
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  <FormattedMessage
                    id="modals.invDesc"
                    values={{ date: createdFormatted, method: paymentDisplay, amount: currentPrice }}
                  />
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <FormattedMessage id="modals.pdfBtn" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions - Close button only */}
        <div className="pt-2 flex items-center justify-end border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" size="sm" onClick={onClose}>
            <FormattedMessage id="modals.closeBtn" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
