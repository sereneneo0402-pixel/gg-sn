import React, { useState } from 'react';
import { CheckCircle2, Plus, ShieldCheck } from 'lucide-react';
import { PRODUCT_SPECS } from '../data/businessData';
import { ProductCategory, RegisteredGear, WarrantyClaim } from '../types/businessModel';

interface WarrantyViewProps {
  registeredGear: RegisteredGear[];
  warrantyClaims: WarrantyClaim[];
  onRegisterGear: (item: {
    category: ProductCategory;
    productTitle: string;
    serialCode: string;
  }) => void;
  onSubmitClaim: (claim: {
    gearId: string;
    defectType: string;
    description: string;
  }) => void;
}

const DEFECT_TYPES = [
  'Seam or Bumper Separation',
  'Earbud Hinge / Carabiner Latch Fatigue',
  'Bottle Vacuum Seal Loss',
  'Surface Coating or Engraving Defect',
];

export const WarrantyView: React.FC<WarrantyViewProps> = ({
  registeredGear,
  warrantyClaims,
  onRegisterGear,
  onSubmitClaim,
}) => {
  const [regCategory, setRegCategory] = useState<ProductCategory>('laptop');
  const [regTitle, setRegTitle] = useState('360° Ribbed Laptop Sleeve (Custom Build)');
  const [regSerial, setRegSerial] = useState('');
  const [regNotice, setRegNotice] = useState('');

  const [claimGearId, setClaimGearId] = useState<string>(registeredGear[0]?.id ?? '');
  const [defectType, setDefectType] = useState<string>(DEFECT_TYPES[0]);
  const [claimDesc, setClaimDesc] = useState('');
  const [claimNotice, setClaimNotice] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSerial =
      regSerial.trim().toUpperCase() ||
      `CA-${regCategory.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 89999)}`;
    onRegisterGear({
      category: regCategory,
      productTitle: regTitle.trim() || PRODUCT_SPECS[regCategory].name,
      serialCode: cleanSerial,
    });
    setRegSerial('');
    setRegNotice(`Registered ${cleanSerial} under 365-day manufacturing defect coverage.`);
    setTimeout(() => setRegNotice(''), 4000);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimGearId || !claimDesc.trim()) return;
    onSubmitClaim({
      gearId: claimGearId,
      defectType,
      description: claimDesc.trim(),
    });
    setClaimDesc('');
    setClaimNotice('Defect claim logged. QA review completes within 24 business hours.');
    setTimeout(() => setClaimNotice(''), 4000);
  };

  return (
    <div className="space-y-10">
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-slate-500">
            Holistic Protection Assurance · Phones, Earbuds, Laptops &amp; Bottles
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 mt-1 text-balance">
            1-Year Manufacturing Defect Warranty
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Every custom build and Designer Series accessory includes 365 days of manufacturing defect protection backed by our material suppliers and in-house QA team.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-mono tabular-nums">{registeredGear.length} Registered Items</span>
        </div>
      </section>

      {/* Registered Gear Coverage Table */}
      <section className="bg-white border border-[#E4E7DF] rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            Your Registered Gear &amp; Active Warranty Countdown
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registering all 4 accessory categories unlocks full drop-risk analytics in your Insights dashboard.
          </p>
        </div>

        {registeredGear.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            No gear registered yet. Add your serial code below or complete an order from Studio.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-2.5 pr-4">Serial Code</th>
                  <th className="py-2.5 px-4">Product</th>
                  <th className="py-2.5 px-4">Purchase Date</th>
                  <th className="py-2.5 px-4">365-Day Window</th>
                  <th className="py-2.5 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {registeredGear.map((gear) => {
                  const pct = Math.max(0, Math.min(100, Math.round((gear.warrantyDaysRemaining / 365) * 100)));
                  const statusColor =
                    gear.status === 'Active Coverage'
                      ? 'text-emerald-700'
                      : gear.status === 'Claim Under Review'
                      ? 'text-amber-700'
                      : 'text-blue-700';
                  return (
                    <tr key={gear.id} className="hover:bg-slate-50">
                      <td className="py-3.5 pr-4 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
                        {gear.serialCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{gear.productTitle}</div>
                        <div className="text-xs text-slate-500">
                          {PRODUCT_SPECS[gear.category].shortName} · {PRODUCT_SPECS[gear.category].dropRating}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-xs text-slate-600 whitespace-nowrap">
                        {gear.purchaseDate}
                      </td>
                      <td className="py-3.5 px-4 min-w-[160px]">
                        <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-700 mb-1">
                          <span>{gear.warrantyDaysRemaining} days left</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              gear.warrantyDaysRemaining < 95 ? 'bg-amber-600' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className={`py-3.5 pl-4 text-right text-xs font-semibold whitespace-nowrap ${statusColor}`}>
                        {gear.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Register Gear + Submit Claim Split */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <form
          onSubmit={handleRegisterSubmit}
          className="bg-white border border-[#E4E7DF] rounded-2xl p-6 space-y-4"
        >
          <div className="pb-3 border-b border-slate-200">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Register New Product Serial
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Activate your 1-year manufacturing defect warranty and sync with Personal Analytics.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-cat" className="text-xs font-semibold text-slate-700">
              Accessory Category
            </label>
            <select
              id="reg-cat"
              value={regCategory}
              onChange={(e) => {
                const cat = e.target.value as ProductCategory;
                setRegCategory(cat);
                setRegTitle(PRODUCT_SPECS[cat].name);
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="phone">Phones — Active Grip Phone Armor</option>
              <option value="earbuds">Earbuds — Carabiner Earbud Shell</option>
              <option value="laptop">Laptops — 360° Ribbed Laptop Sleeve</option>
              <option value="bottle">Bottles — Insulated Bottle &amp; Grip Sleeve</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-title" className="text-xs font-semibold text-slate-700">
              Edition / Build Name
            </label>
            <input
              id="reg-title"
              type="text"
              required
              value={regTitle}
              onChange={(e) => setRegTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-serial" className="text-xs font-semibold text-slate-700">
              Serial Code (Leave blank to auto-generate test serial)
            </label>
            <input
              id="reg-serial"
              type="text"
              value={regSerial}
              onChange={(e) => setRegSerial(e.target.value)}
              placeholder="e.g. CA-LPT-90214"
              className="w-full px-3.5 py-2.5 text-sm font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Activate 1-Year Coverage</span>
          </button>

          {regNotice && (
            <p className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{regNotice}</span>
            </p>
          )}
        </form>

        {/* Submit Defect Claim */}
        <form
          onSubmit={handleClaimSubmit}
          className="bg-white border border-[#E4E7DF] rounded-2xl p-6 space-y-4"
        >
          <div className="pb-3 border-b border-slate-200">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Submit Manufacturing Defect Claim
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Covered defects receive a free replacement shipped directly from our supplier QA batch.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="claim-gear" className="text-xs font-semibold text-slate-700">
              Registered Item
            </label>
            <select
              id="claim-gear"
              value={claimGearId}
              onChange={(e) => setClaimGearId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {registeredGear.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.serialCode} — {g.productTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="claim-defect" className="text-xs font-semibold text-slate-700">
              Defect Category
            </label>
            <select
              id="claim-defect"
              value={defectType}
              onChange={(e) => setDefectType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {DEFECT_TYPES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="claim-desc" className="text-xs font-semibold text-slate-700">
              Inspection Notes
            </label>
            <textarea
              id="claim-desc"
              rows={3}
              required
              value={claimDesc}
              onChange={(e) => setClaimDesc(e.target.value)}
              placeholder="Describe the manufacturing defect observed..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={registeredGear.length === 0}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Submit Warranty Claim
          </button>

          {claimNotice && (
            <p className="text-xs font-medium text-emerald-700">{claimNotice}</p>
          )}

          {warrantyClaims.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-700">Active Claims</div>
              <div className="divide-y divide-slate-100">
                {warrantyClaims.map((c) => (
                  <div key={c.id} className="py-2 text-xs flex items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-semibold text-slate-900">{c.serialCode}</span>
                      <span className="text-slate-600"> · {c.defectType}</span>
                    </div>
                    <span className="font-semibold text-amber-700">{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};
