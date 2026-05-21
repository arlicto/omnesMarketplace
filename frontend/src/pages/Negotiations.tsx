import React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';

export const Negotiations: React.FC = () => {
  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <header className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-gutter border-b border-outline-variant pb-stack-md">
          <div className="flex gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container border border-outline-variant flex-shrink-0">
              <img alt="Negotiation Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBFm2m6Opn8_fQhxcyMYPtX70IrKtF7z4xy7-W2O96VvWhCheZyUZLzVp83qc3KNvgk2g7YO5stybuBiI3L3hq1M6fP1trOgb9r_77qyv6Z2jyBaVChfYDXwLVYp9VmEC3Cc6GWBUAmBNY74j0hNaetkpON0lyKFtYFxFy70ipH3HFTC309KczGlea6pwD5ts7tTmnS5HzvtiVVTrkEk_r2Si913p1wbqgVcr6Jqbr9f_YTJXVuQsZwyQcLNBDh-EngP5Z7nuJ1hw" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Negotiation Active</span>
                <span className="text-label-sm text-on-surface-variant">Room ID: #NEG-2024-X91</span>
              </div>
              <h1 className="text-headline-md font-headline-md text-primary">Studio Pro Audio System</h1>
              <p className="text-body-md text-on-surface-variant">Seller: <span className="font-bold text-primary">Elite Collector Group</span></p>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-label-md">Current Best Offer: <span className="font-bold text-secondary text-headline-sm">$450.00</span></p>
                <p className="text-label-md text-on-surface-variant line-through">Listing Price: $520.00</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <span className="material-symbols-outlined">flag</span> Report
            </Button>
            <Button className="bg-secondary text-on-secondary hover:bg-secondary/90 shadow-md">Accept Current Offer</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Chat Interface */}
          <section className="lg:col-span-2 flex flex-col bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="bg-surface-container-low p-4 border-b border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-label-md font-bold text-primary">Secure Chatroom</span>
              </div>
              <span className="text-label-sm text-on-surface-variant">Messages are encrypted and recorded for safety.</span>
            </div>
            
            <div className="flex-grow p-6 space-y-6 min-h-[500px] overflow-y-auto bg-surface-bright/30">
              <ChatMessage 
                sender="Seller" 
                time="10:15 AM" 
                message="Thank you for your interest in the Studio Pro Audio system. I've reviewed your initial offer of $400, but I cannot go lower than $480 given the pristine condition." 
              />
              <ChatMessage 
                sender="You" 
                time="10:22 AM" 
                message="I understand. Would you consider $450? I can complete the transaction today and pick up from the campus hub." 
                isMe
              />
              <ChatMessage 
                sender="Seller" 
                time="10:25 AM" 
                message="I've updated the counter-offer to $450 as per your request. Please confirm by clicking the accept button above." 
              />
            </div>

            <div className="p-4 border-t border-outline-variant bg-white">
              <div className="flex gap-4">
                <div className="flex-grow relative">
                  <textarea 
                    className="w-full rounded-lg border border-outline-variant p-3 pr-12 focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-12" 
                    placeholder="Type your message or counter-offer..."
                  ></textarea>
                  <button className="absolute right-3 top-3 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">attach_file</span>
                  </button>
                </div>
                <Button className="px-8">Send</Button>
              </div>
            </div>
          </section>

          {/* Guidelines & Meta */}
          <aside className="space-y-gutter">
            <div className="bg-primary-container/10 rounded-xl border border-primary/20 p-6">
              <h3 className="text-label-md font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-headline-sm">gavel</span> Negotiation Rules
              </h3>
              <ul className="space-y-3 text-body-md text-on-surface-variant">
                <li className="flex gap-3"><span className="text-primary font-bold">1.</span> Offers are legally binding once accepted.</li>
                <li className="flex gap-3"><span className="text-primary font-bold">2.</span> Harassment or off-platform payment talk results in a ban.</li>
                <li className="flex gap-3"><span className="text-primary font-bold">3.</span> You have 24 hours to pay after an offer is accepted.</li>
              </ul>
            </div>
            
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6">
              <h3 className="text-label-md font-bold text-primary uppercase tracking-widest mb-4">Transaction Details</h3>
              <div className="space-y-4">
                <DetailRow label="Shipping Method" value="In-person Campus Pickup" />
                <DetailRow label="Payment Method" value="Secure Marketplace Escrow" />
                <DetailRow label="Condition" value="Like New (Boxed)" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
};

const ChatMessage: React.FC<{ sender: string, time: string, message: string, isMe?: boolean }> = ({ 
  sender, time, message, isMe 
}) => (
  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
    <div className={`max-w-[80%] rounded-2xl p-4 ${
      isMe ? 'bg-primary text-on-primary rounded-tr-none' : 'bg-white border border-outline-variant rounded-tl-none'
    }`}>
      <div className="flex justify-between items-center gap-4 mb-1">
        <span className="text-label-sm font-bold uppercase tracking-wider">{sender}</span>
        <span className={`text-[10px] ${isMe ? 'text-primary-fixed opacity-70' : 'text-on-surface-variant'}`}>{time}</span>
      </div>
      <p className="text-body-md leading-relaxed">{message}</p>
    </div>
  </div>
);

const DetailRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div>
    <p className="text-label-sm text-on-surface-variant">{label}</p>
    <p className="text-label-md font-bold text-primary">{value}</p>
  </div>
);
