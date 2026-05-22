import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import apiClient from '../services/apiClient';

interface Negotiation {
  id: number;
  uuid: string;
  product_id: number;
  buyer_id: number;
  seller_id: number;
  status: string;
  initial_offer: number;
  current_offer: number;
  buyer_message: string | null;
  seller_message: string | null;
  expires_at: string;
  created_at: string;
  product_name: string;
  product_price: number;
  seller_username: string;
  buyer_username: string;
  image_url: string | null;
  thumbnail_url: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-primary-container text-on-primary-container',
  countered: 'bg-primary-container text-on-primary-container',
  accepted: 'bg-secondary-container text-on-secondary-container',
  rejected: 'bg-error-container text-on-error-container',
  expired: 'bg-surface-variant text-on-surface-variant',
};

export const Negotiations: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const idParam = searchParams.get('id');
  const productIdParam = searchParams.get('product_id');

  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [counterInput, setCounterInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const isOpen = negotiation && (negotiation.status === 'pending' || negotiation.status === 'countered');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');

      try {
        if (idParam) {
          const res = await apiClient.get(`/negotiations/offers/${idParam}`);
          setNegotiation(res.data.negotiation);
        } else {
          const res = await apiClient.get('/negotiations/offers/buyer');
          setNegotiations(res.data.negotiations || []);
        }
      } catch {
        setError('Failed to load negotiations.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idParam]);

  const handleCreateOffer = async () => {
    if (!offerPrice) return;
    setIsCreating(true);
    try {
      await apiClient.post('/negotiations/offers', {
        product_id: Number(productIdParam),
        offer: Number(offerPrice),
        message: offerMessage || undefined,
      });
      setOfferPrice('');
      setOfferMessage('');
      const res = await apiClient.get('/negotiations/offers/buyer');
      setNegotiations(res.data.negotiations || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create offer.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAccept = async () => {
    if (!negotiation) return;
    setIsSending(true);
    try {
      await apiClient.post(`/negotiations/offers/${negotiation.id}/accept`);
      navigate('/negotiations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept offer.');
    } finally {
      setIsSending(false);
    }
  };

  const handleReject = async () => {
    if (!negotiation) return;
    setIsSending(true);
    try {
      await apiClient.post(`/negotiations/offers/${negotiation.id}/reject`);
      navigate('/negotiations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject offer.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCounter = async () => {
    if (!negotiation || !counterInput.trim()) return;
    setIsSending(true);
    const val = counterInput.trim();
    const numMatch = val.match(/^(\d+(?:\.\d+)?)\s*(.*)/);
    const hasNumber = numMatch && !isNaN(Number(numMatch[1]));

    try {
      if (hasNumber) {
        await apiClient.post(`/negotiations/offers/${negotiation.id}/counter`, {
          counter_offer: Number(numMatch![1]),
          message: numMatch![2].trim() || undefined,
        });
      } else {
        await apiClient.post(`/negotiations/offers/${negotiation.id}/counter`, {
          counter_offer: Number(negotiation.current_offer),
          message: val,
        });
      }
      const res = await apiClient.get(`/negotiations/offers/${negotiation.id}`);
      setNegotiation(res.data.negotiation);
      setCounterInput('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (idParam && negotiation) {
    return (
      <Layout>
        <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
          <button onClick={() => navigate('/negotiations')} className="flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary mb-stack-md transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Negotiations
          </button>

          {error && (
            <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg border border-error">{error}</div>
          )}

          <header className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-gutter border-b border-outline-variant pb-stack-md">
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container border border-outline-variant flex-shrink-0 flex items-center justify-center">
                {negotiation.image_url ? (
                  <img alt={negotiation.product_name} className="w-full h-full object-cover" src={negotiation.image_url} />
                ) : (
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">image</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_STYLES[negotiation.status] || 'bg-surface-variant text-on-surface-variant'}`}>
                    {negotiation.status}
                  </span>
                  <span className="text-label-sm text-on-surface-variant">Ref: #{negotiation.id}</span>
                </div>
                <h1 className="text-headline-md font-headline-md text-primary">{negotiation.product_name}</h1>
                <p className="text-body-md text-on-surface-variant">Seller: <span className="font-bold text-primary">{negotiation.seller_username}</span></p>
                <div className="mt-2 flex items-center gap-4">
                  <p className="text-label-md">Current Offer: <span className="font-bold text-secondary text-headline-sm">${Number(negotiation.current_offer).toLocaleString()}</span></p>
                  <p className="text-label-md text-on-surface-variant line-through">Initial: ${Number(negotiation.initial_offer).toLocaleString()}</p>
                </div>
              </div>
            </div>
            {isOpen && (
              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2" onClick={handleReject} disabled={isSending}>
                  Reject Offer
                </Button>
                <Button className="bg-secondary text-on-secondary hover:bg-secondary/90 shadow-md" onClick={handleAccept} disabled={isSending}>
                  Accept Current Offer
                </Button>
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <section className="lg:col-span-2 flex flex-col bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
              <div className="bg-surface-container-low p-4 border-b border-outline-variant flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-secondary animate-pulse' : 'bg-surface-variant'}`}></div>
                  <span className="text-label-md font-bold text-primary">Negotiation Thread</span>
                </div>
                <span className="text-label-sm text-on-surface-variant">Created {new Date(negotiation.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex-grow p-6 space-y-6 min-h-[400px] overflow-y-auto bg-surface-bright/30">
                {negotiation.buyer_message && (
                  <ChatMessage sender="You" time="" message={negotiation.buyer_message} isMe />
                )}
                {negotiation.seller_message && (
                  <ChatMessage sender={negotiation.seller_username} time="" message={negotiation.seller_message} />
                )}
                {!negotiation.buyer_message && !negotiation.seller_message && (
                  <p className="text-body-md text-on-surface-variant text-center py-12">No messages yet.</p>
                )}
              </div>

              {isOpen && (
                <div className="p-4 border-t border-outline-variant bg-white">
                  <div className="flex gap-4">
                    <div className="flex-grow">
                      <textarea
                        className="w-full rounded-lg border border-outline-variant p-3 focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-12"
                        placeholder="Enter a number for counter-offer, or type a message..."
                        value={counterInput}
                        onChange={(e) => setCounterInput(e.target.value)}
                      ></textarea>
                    </div>
                    <Button className="px-8" onClick={handleCounter} disabled={isSending || !counterInput.trim()}>
                      {isSending ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
              )}
            </section>

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
                <h3 className="text-label-md font-bold text-primary uppercase tracking-widest mb-4">Details</h3>
                <div className="space-y-4">
                  <DetailRow label="Status" value={negotiation.status} />
                  <DetailRow label="Initial Offer" value={`$${Number(negotiation.initial_offer).toLocaleString()}`} />
                  <DetailRow label="Current Offer" value={`$${Number(negotiation.current_offer).toLocaleString()}`} />
                  <DetailRow label="Expires" value={new Date(negotiation.expires_at).toLocaleDateString()} />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <header className="mb-stack-lg">
          <h1 className="text-headline-xl font-headline-xl text-primary">My Negotiations</h1>
          <p className="text-body-lg text-on-surface-variant mt-2">Track and manage your active offers.</p>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg border border-error">{error}</div>
        )}

        {productIdParam && (
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant mb-stack-lg">
            <h2 className="text-headline-md font-headline-md text-primary mb-4">Create Offer for Product #{productIdParam}</h2>
            <div className="flex flex-wrap items-end gap-gutter">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Your Offer ($)</label>
                <input
                  className="w-full border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-body-md py-2 px-3 bg-surface-bright"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Message (optional)</label>
                <input
                  className="w-full border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-body-md py-2 px-3 bg-surface-bright"
                  placeholder="Add a note..."
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateOffer} disabled={isCreating || !offerPrice}>
                {isCreating ? 'Submitting...' : 'Submit Offer'}
              </Button>
            </div>
          </section>
        )}

        {negotiations.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">forum</span>
            <p className="text-body-lg text-on-surface-variant">No negotiations yet.</p>
            <p className="text-body-md text-on-surface-variant mt-1">Browse products and make an offer to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {negotiations.map((neg) => (
              <div key={neg.id} className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 flex items-center justify-center">
                    {neg.image_url ? (
                      <img alt={neg.product_name} className="w-full h-full object-cover" src={neg.image_url} />
                    ) : (
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant/30">image</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">{neg.product_name}</h3>
                    <p className="text-label-sm text-on-surface-variant">
                      Offered: ${Number(neg.initial_offer).toLocaleString()}
                      {Number(neg.current_offer) !== Number(neg.initial_offer) && (
                        <> · Current: <span className="font-bold text-secondary">${Number(neg.current_offer).toLocaleString()}</span></>
                      )}
                    </p>
                    <p className="text-label-sm text-on-surface-variant">Seller: {neg.seller_username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_STYLES[neg.status] || 'bg-surface-variant text-on-surface-variant'}`}>
                    {neg.status}
                  </span>
                  <Button onClick={() => navigate(`/negotiations?id=${neg.id}`)}>View Details</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
};

const ChatMessage: React.FC<{ sender: string; time: string; message: string; isMe?: boolean }> = ({
  sender, time, message, isMe,
}) => (
  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
    <div className={`max-w-[80%] rounded-2xl p-4 ${
      isMe ? 'bg-primary text-on-primary rounded-tr-none' : 'bg-white border border-outline-variant rounded-tl-none'
    }`}>
      <div className="flex justify-between items-center gap-4 mb-1">
        <span className="text-label-sm font-bold uppercase tracking-wider">{sender}</span>
        {time && <span className={`text-[10px] ${isMe ? 'text-primary-fixed opacity-70' : 'text-on-surface-variant'}`}>{time}</span>}
      </div>
      <p className="text-body-md leading-relaxed">{message}</p>
    </div>
  </div>
);

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-label-sm text-on-surface-variant">{label}</p>
    <p className="text-label-md font-bold text-primary">{value}</p>
  </div>
);
