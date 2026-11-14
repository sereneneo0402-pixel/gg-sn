import React, { useMemo, useState } from 'react';
import { Calendar, Check, MapPin, Vote } from 'lucide-react';
import {
  CHANNEL_EVENTS,
  PRODUCT_SPECS,
  SUPPLIER_LEDGER,
} from '../data/businessData';
import {
  B2BQuoteRecord,
  MarketPollOption,
  ProductCategory,
} from '../types/businessModel';

interface PartnersEventsViewProps {
  rsvpEventIds: string[];
  onToggleRsvp: (eventId: string) => void;
  pollOptions: MarketPollOption[];
  votedPollId: string | null;
  onVotePoll: (optionId: string) => void;
  b2bQuotes: B2BQuoteRecord[];
  onSubmitB2BQuote: (quote: Omit<B2BQuoteRecord, 'id' | 'submittedAt'>) => void;
}

type EventFilter = 'All' | 'Pop-up Store' | 'Corporate Collab' | 'Run Club';

export const PartnersEventsView: React.FC<PartnersEventsViewProps> = ({
  rsvpEventIds,
  onToggleRsvp,
  pollOptions,
  votedPollId,
  onVotePoll,
  b2bQuotes,
  onSubmitB2BQuote,
}) => {
  const [eventFilter, setEventFilter] = useState<EventFilter>('All');
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<B2BQuoteRecord['orgType']>('School / University');
  const [quantity, setQuantity] = useState(100);
  const [selectedCats, setSelectedCats] = useState<ProductCategory[]>(['bottle', 'laptop']);
  const [crestText, setCrestText] = useState('WESTFIELD');
  const [quoteSubmittedMsg, setQuoteSubmittedMsg] = useState('');

  const filteredEvents = useMemo(() => {
    if (eventFilter === 'All') return CHANNEL_EVENTS;
    return CHANNEL_EVENTS.filter((e) => e.channelType === eventFilter);
  }, [eventFilter]);

  const totalPollVotes = useMemo(
    () => pollOptions.reduce((sum, opt) => sum + opt.votes, 0),
    [pollOptions]
  );

  const unitBundleBase = useMemo(
    () => selectedCats.reduce((sum, cat) => sum + PRODUCT_SPECS[cat].basePrice, 0),
    [selectedCats]
  );

  const bulkDiscountPct = quantity >= 250 ? 0.28 : quantity >= 100 ? 0.22 : 0.15;
  const estimatedB2BTotal = Math.round(unitBundleBase * (1 - bulkDiscountPct) * quantity);

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCats((prev) => {
      if (prev.includes(cat)) {
        return prev.length > 1 ? prev.filter((c) => c !== cat) : prev;
      }
      return [...prev, cat];
    });
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    onSubmitB2BQuote({
      organization: orgName.trim(),
      orgType,
      quantity,
      categories: selectedCats,
      crestText: crestText.trim().toUpperCase() || 'CUSTOM',
      estimatedTotal: estimatedB2BTotal,
    });
    setOrgName('');
    setQuoteSubmittedMsg('Bulk partnership proposal logged. Dedicated account lead assigned.');
    setTimeout(() => setQuoteSubmittedMsg(''), 4000);
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <section className="space-y-2">
        <div className="text-xs font-medium text-slate-500">
          Key Partners · Channels · Key Activities · B2B &amp; School Revenue Stream
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-900 text-balance">
          Partners, Pop-Up Channels &amp; B2B Co-Branding
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Collaborating with our Bottle Manufacturer, KOL creators, school networks, and corporate wellness teams across online and offline pop-up events.
        </p>
      </section>

      {/* B2B / School Bulk Portal ($120,000/yr Revenue Stream) + Market Research Poll */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-[#E4E7DF] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                B2B &amp; School Co-Branded Kit Configurator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Custom bulk runs for universities, school districts, gyms, and corporate brand collabs.
              </p>
            </div>
            <div className="font-mono tabular-nums text-xs font-semibold text-emerald-700">
              {Math.round(bulkDiscountPct * 100)}% Volume Tier Active
            </div>
          </div>

          <form onSubmit={handleQuoteSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="b2b-org" className="text-xs font-semibold text-slate-700">
                  Organization / School Name
                </label>
                <input
                  id="b2b-org"
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Westfield Athletics"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="b2b-type" className="text-xs font-semibold text-slate-700">
                  Partner Segment
                </label>
                <select
                  id="b2b-type"
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value as B2BQuoteRecord['orgType'])}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="School / University">School / University</option>
                  <option value="Corporate Wellness">Corporate Wellness</option>
                  <option value="Gym Chain">Gym Chain</option>
                  <option value="Running Club">Running Club</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Kit Quantity (25 – 500 kits)</span>
                <span className="font-mono tabular-nums text-slate-900">{quantity} kits</span>
              </div>
              <input
                type="range"
                min={25}
                max={500}
                step={25}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">Included Gear</div>
                <div className="grid grid-cols-2 gap-2">
                  {(['bottle', 'laptop', 'phone', 'earbuds'] as ProductCategory[]).map((cat) => {
                    const active = selectedCats.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {PRODUCT_SPECS[cat].shortName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="b2b-crest" className="text-xs font-semibold text-slate-700">
                  Co-Branded Laser Crest Text
                </label>
                <input
                  id="b2b-crest"
                  type="text"
                  maxLength={14}
                  value={crestText}
                  onChange={(e) => setCrestText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">
                  Estimated Bulk Total (1-Year Defect Warranty per Unit)
                </div>
                <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-0.5">
                  ${estimatedB2BTotal.toLocaleString()}
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Request B2B / School Quote
              </button>
            </div>

            {quoteSubmittedMsg && (
              <p className="text-xs font-medium text-emerald-700">{quoteSubmittedMsg}</p>
            )}
          </form>

          {b2bQuotes.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-700">Recent Partnership Proposals</div>
              <div className="divide-y divide-slate-100">
                {b2bQuotes.map((q) => (
                  <div key={q.id} className="py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-slate-900">
                      {q.organization} · {q.orgType} ({q.quantity} kits · {q.crestText})
                    </span>
                    <span className="font-mono tabular-nums text-slate-700">
                      ${q.estimatedTotal.toLocaleString()} · {q.submittedAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Key Activity: Conduct Market Research Poll */}
        <div className="lg:col-span-5 bg-white border border-[#E4E7DF] rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Vote className="w-3.5 h-3.5" />
              <span>Key Activity · Conduct Market Research &amp; R&amp;D</span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mt-1">
              Next Quarter Product R&amp;D Vote
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Community feedback directly prioritizes our Bottle Manufacturer tooling and material sourcing roadmap.
            </p>
          </div>

          <div className="space-y-3">
            {pollOptions.map((opt) => {
              const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
              const isSelected = votedPollId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onVotePoll(opt.id)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-900">{opt.label}</span>
                    <span className="font-mono tabular-nums text-slate-600 shrink-0">{pct}%</span>
                  </div>
                  <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-700'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{opt.category}</span>
                    <span className="font-mono tabular-nums">{opt.votes} votes</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Channels: Offline Events (Pop-Up Stores) & Corporate Brand Collabs */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Pop-Up Stores &amp; Corporate Brand Collabs
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Reserve an on-site custom engraving slot or brand collaboration drop session.
            </p>
          </div>

          <div className="flex flex-wrap gap-1 p-1 bg-slate-200/70 rounded-lg w-fit">
            {(['All', 'Pop-up Store', 'Corporate Collab', 'Run Club'] as EventFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setEventFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  eventFilter === f
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((evt) => {
            const isRsvped = rsvpEventIds.includes(evt.id);
            return (
              <div
                key={evt.id}
                className="bg-white border border-[#E4E7DF] rounded-2xl p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{evt.channelType} · {evt.partner}</span>
                    <span className="font-mono tabular-nums">
                      {Math.max(0, evt.spotsRemaining - (isRsvped ? 1 : 0))} spots left
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-slate-900">{evt.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{evt.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.location}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleRsvp(evt.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      isRsvped
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isRsvped && <Check className="w-3.5 h-3.5" />}
                    <span>{isRsvped ? 'RSVP Confirmed' : 'Reserve Spot'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Partners & Suppliers Ledger */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Key Partners, Material Suppliers &amp; Skilled R&amp;D Teams
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vetted suppliers supporting 1-year defect warranty standards across bottles, polymers, textiles, and KOL collaborations.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-2.5 pr-4">Partner / Supplier</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Supply / Activity Scope</th>
                <th className="py-2.5 px-4 text-right">Lead Time</th>
                <th className="py-2.5 pl-4 text-right">QA Defect Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {SUPPLIER_LEDGER.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-slate-900">{sup.name}</div>
                    <div className="text-xs text-slate-500">{sup.sustainabilityNote}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700 whitespace-nowrap">{sup.partnerType}</td>
                  <td className="py-3 px-4 text-xs text-slate-600">{sup.category}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900">
                    {sup.leadTimeDays}d
                  </td>
                  <td className="py-3 pl-4 text-right font-mono tabular-nums text-emerald-700">
                    {sup.defectRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
