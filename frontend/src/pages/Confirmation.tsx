import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Confirmation = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex-grow w-full">
        <div className="mb-stack-lg flex items-center justify-center space-x-4 md:space-x-8">
          <div className="flex items-center">
            <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-label-md mr-2">
              <span className="material-symbols-outlined text-sm">check</span>
            </span>
            <span className="text-label-md text-on-surface-variant">Delivery Info</span>
          </div>
          <div className="h-[2px] w-8 md:w-16 bg-primary"></div>
          <div className="flex items-center">
            <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-label-md mr-2">
              <span className="material-symbols-outlined text-sm">check</span>
            </span>
            <span className="text-label-md text-on-surface-variant">Payment</span>
          </div>
          <div className="h-[2px] w-8 md:w-16 bg-primary"></div>
          <div className="flex items-center">
            <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-md mr-2">3</span>
            <span className="text-label-md font-bold text-primary">Confirmation</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-stack-lg">
          <div className="bg-surface-container-lowest p-stack-lg rounded-xl shadow-sm border border-outline-variant space-y-stack-md">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
            </div>

            <h1 className="text-headline-xl font-headline-xl text-primary">Order Confirmed!</h1>
            <p className="text-body-lg text-on-surface-variant max-w-md mx-auto">
              Thank you for your purchase. Your order has been placed successfully and is being processed.
            </p>

            <div className="bg-surface-container rounded-lg p-stack-md text-left space-y-3 border border-outline-variant">
              <div className="flex justify-between items-center">
                <span className="text-label-sm text-on-surface-variant">Order Number</span>
                <span className="text-label-md font-bold text-primary">#OMN-8842</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-label-sm text-on-surface-variant">Date</span>
                <span className="text-label-md text-on-surface">May 28, 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-label-sm text-on-surface-variant">Payment Method</span>
                <span className="text-label-md text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">credit_card</span>
                  **** 3456
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-label-sm text-on-surface-variant">Total Charged</span>
                <span className="text-headline-sm font-bold text-secondary">€369.00</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-lg p-stack-md text-left border border-outline-variant">
              <h3 className="text-label-md font-bold text-on-surface mb-3">Delivery Address</h3>
              <p className="text-body-md text-on-surface-variant">John Doe</p>
              <p className="text-body-md text-on-surface-variant">123 Luxury Avenue</p>
              <p className="text-body-md text-on-surface-variant">Paris, 75001</p>
              <p className="text-body-md text-on-surface-variant">France</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-stack-md">
              <button
                onClick={() => navigate('/account')}
                className="px-8 py-4 bg-primary text-on-primary font-bold rounded-lg shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span className="material-symbols-outlined">receipt_long</span>
                <span>View Order</span>
              </button>
              <button
                onClick={() => navigate('/browse')}
                className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-on-primary active:scale-95 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          <p className="text-label-sm text-on-surface-variant flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">mail</span>
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </main>
    </Layout>
  );
};

export default Confirmation;
# 1780165085489908501
