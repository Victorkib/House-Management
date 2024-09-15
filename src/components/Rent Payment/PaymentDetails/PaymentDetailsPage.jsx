import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { ThreeDots } from 'react-loader-spinner'; // Import ThreeDots loader
import './PaymentDetailsPage.scss';
import { FaMoneyBill, FaReceipt, FaFileInvoice } from 'react-icons/fa';

const PaymentDetailsPage = () => {
  const location = useLocation();
  const paymentDetails = location.state?.payment || {};
  const onEntryOverPay = location.state?.onEntryOverPay || 0;
  const [loading, setLoading] = useState(false); // State to control loader visibility

  // eslint-disable-next-line no-unused-vars
  const generatePDF = (content, fileName) => {
    setLoading(true); // Show loader

    html2pdf()
      .from(content)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const pdfUrl = URL.createObjectURL(pdf.output('blob'));
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.location.href = pdfUrl;
        }
        setLoading(false); // Hide loader
      });
  };

  const generateReceipt = () => {
    const content = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            text-align: center;
            color: #333;
          }
          .details {
            margin-bottom: 20px;
          }
          .details p {
            margin: 5px 0;
            font-size: 16px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Receipt</h1>
          <div class="details">
            <p><strong>Date:</strong> ${paymentDetails.month}</p>
            <p><strong>Rent:</strong> ${paymentDetails.rent.amount}</p>
            <p><strong>Water Bill:</strong> ${paymentDetails.waterBill.amount}</p>
            <p><strong>Garbage Fee:</strong> ${paymentDetails.garbageFee.amount}</p>
            <p><strong>Extra Bills:</strong> ${paymentDetails.extraCharges.amount}</p>
            <p><strong>Total Amount:</strong> ${paymentDetails.totalAmountPaid}</p>
            <p><strong>Current Excess Pay:</strong> ${paymentDetails.overpay}</p>
            <p><strong>Deficit Balance:</strong> ${paymentDetails.globalDeficit}</p>
            <p><strong>Reference No:</strong> ${paymentDetails.referenceNumber}</p>
            <p><strong>Payment Maker:</strong></p>
            <p>Name: ${paymentDetails.tenant.name}</p>
            <p>Email: ${paymentDetails.tenant.email}</p>
          </div>
          <div class="footer">
            <p>Thank you for your payment!</p>
          </div>
        </div>
      </body>
      </html>
    `;
    generatePDF(content, 'receipt.pdf');
  };

  const generateInvoice = () => {
    const content = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            text-align: center;
            color: #333;
          }
          .details {
            margin-bottom: 20px;
          }
          .details p {
            margin: 5px 0;
            font-size: 16px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Invoice</h1>
          <div class="details">
            <p><strong>Date:</strong> ${paymentDetails.month}</p>
            <p><strong>Rent:</strong> ${paymentDetails.rent.amount}</p>
            <p><strong>Water Bill:</strong> ${paymentDetails.waterBill.amount}</p>
            <p><strong>Garbage Fee:</strong> ${paymentDetails.garbageFee.amount}</p>
            <p><strong>Extra Bills:</strong> ${paymentDetails.extraCharges.amount}</p>
            <p><strong>Total Amount:</strong> ${paymentDetails.totalAmountPaid}</p>
            <p><strong>Reference No:</strong> ${paymentDetails.referenceNumber}</p>
            <p><strong>Payment Maker:</strong></p>
            <p>Name: ${paymentDetails.tenant.name}</p>
            <p>Email: ${paymentDetails.tenant.email}</p>
          </div>
          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </body>
      </html>
    `;
    generatePDF(content, 'invoice.pdf');
  };

  return (
    <div className="payment-details-page">
      {loading && (
        <div className="loader-overlay">
          <ThreeDots color="#3498db" height={80} width={80} />
        </div>
      )}
      {paymentDetails ? (
        <>
          <div className="cards-container">
            <div className="left-card">
              <div className="minicard payment-details">
                <h3>
                  <FaMoneyBill /> Payment Details
                </h3>
                <p>Month: {paymentDetails?.month}</p>
                <p>Rent: {paymentDetails?.rent?.amount}</p>
                <p>Water Bill: {paymentDetails.waterBill.amount}</p>
                <p>Garbage Fee: {paymentDetails.garbageFee.amount}</p>
                <p>Extra Bills: {paymentDetails.extraCharges.amount}</p>
                {/* <p>Total Amount: {paymentDetails.totalAmount}</p> */}
                <hr />
                <p>
                  Amount Paid:{' '}
                  <span className="amountPaid">
                    {paymentDetails.totalAmountPaid}
                  </span>
                </p>
                {onEntryOverPay ? <p>On Entry Overpay {onEntryOverPay}</p> : ''}

                {/* <p>
                  Previous Excess Pay:{' '}
                  <span className="currentExcessPay">
                    {paymentDetails.overpay}
                  </span>
                </p> */}
                <p>
                  Current Excess Pay:{' '}
                  <span className="currentExcessPay">
                    {paymentDetails.overpay}
                  </span>
                </p>
                <p>
                  Deficit:{' '}
                  <span className="balance">
                    {' '}
                    {paymentDetails.globalDeficit}
                  </span>
                </p>
                {/* <p>
                  Balance:{' '}
                  <span className="balance">{paymentDetails.balance}</span>
                </p> */}
                <p className="reference-no">
                  Reference No: {paymentDetails.referenceNumber}
                </p>
              </div>
              <div className="minicard payment-maker">
                <h3>
                  <FaReceipt /> Payment Maker
                </h3>
                <p>Name: {paymentDetails.tenant.name}</p>
                <hr />
                <p>Email: {paymentDetails.tenant.email}</p>
              </div>
            </div>
            <div className="right-card">
              <h3>Advanced</h3>
              <div className="button-container">
                <button className="generate-invoice" onClick={generateInvoice}>
                  <FaFileInvoice /> Generate Invoice
                </button>
                <button className="generate-receipt" onClick={generateReceipt}>
                  <FaReceipt /> Generate Receipt
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
  );
};

export default PaymentDetailsPage;
