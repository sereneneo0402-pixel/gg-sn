import React, { useEffect, useMemo, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { AnalyticsView } from './components/AnalyticsView';
import { CartDrawer } from './components/CartDrawer';
import { LifestyleHubView } from './components/LifestyleHubView';
import { PartnersEventsView } from './components/PartnersEventsView';
import { StudioView } from './components/StudioView';
import { WarrantyView } from './components/WarrantyView';
import {
  INITIAL_HABIT_LOGS,
  INITIAL_MARKET_POLL,
  INITIAL_REGISTERED_GEAR,
  PRODUCT_SPECS,
} from './data/businessData';
import {
  B2BQuoteRecord,
  CartItem,
  CustomConfig,
  DailyHabitLog,
  MarketPollOption,
  NavTab,
  NewsletterState,
  ProductCategory,
  RegisteredGear,
  SegmentId,
  WarrantyClaim,
} from './types/businessModel';

const NAV_ITEMS: Array<{ id: NavTab; label: string }> = [
  { id: 'studio', label: 'Studio' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'partners', label: 'Partners' },
  { id: 'warranty', label: 'Warranty' },
];

const STORAGE_KEY = 'cadence_armor_state_v1';

interface PersistedState {
  activeSegment: SegmentId;
  cart: CartItem[];
  registeredGear: RegisteredGear[];
  warrantyClaims: WarrantyClaim[];
  habitLogs: DailyHabitLog[];
  newsletter: NewsletterState;
  rsvpEventIds: string[];
  pollOptions: MarketPollOption[];
  votedPollId: string | null;
  b2bQuotes: B2BQuoteRecord[];
}

function loadInitialState(): PersistedState {
  const defaultHabitLogs: DailyHabitLog[] = [
    ...INITIAL_HABIT_LOGS,
    {
      date: '2026-11-13',
      label: 'Nov 13',
      hydrationMet: false,
      activeCarryMet: true,
      socialShared: false,
      score: 64,
    },
  ];

  const fallback: PersistedState = {
    activeSegment: 'runners',
    cart: [],
    registeredGear: INITIAL_REGISTERED_GEAR,
    warrantyClaims: [],
    habitLogs: defaultHabitLogs,
    newsletter: {
      subscribed: false,
      email: '',
      topics: ['Hydration Pacing & Bottle Care', 'New Designer Series Drops'],
      cadence: 'Weekly Digest',
    },
    rsvpEventIds: [],
    pollOptions: INITIAL_MARKET_POLL,
    votedPollId: null,
    b2bQuotes: [],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...fallback,
      ...parsed,
      habitLogs:
        parsed.habitLogs && parsed.habitLogs.length > 0
          ? parsed.habitLogs
          : fallback.habitLogs,
      pollOptions:
        parsed.pollOptions && parsed.pollOptions.length > 0
          ? parsed.pollOptions
          : fallback.pollOptions,
    };
  } catch {
    return fallback;
  }
}

export default function App() {
  const [initial] = useState<PersistedState>(() => loadInitialState());
  const [activeTab, setActiveTab] = useState<NavTab>('studio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeSegment, setActiveSegment] = useState<SegmentId>(initial.activeSegment);
  const [cart, setCart] = useState<CartItem[]>(initial.cart);
  const [registeredGear, setRegisteredGear] = useState<RegisteredGear[]>(initial.registeredGear);
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>(initial.warrantyClaims);
  const [habitLogs, setHabitLogs] = useState<DailyHabitLog[]>(initial.habitLogs);
  const [newsletter, setNewsletter] = useState<NewsletterState>(initial.newsletter);
  const [rsvpEventIds, setRsvpEventIds] = useState<string[]>(initial.rsvpEventIds);
  const [pollOptions, setPollOptions] = useState<MarketPollOption[]>(initial.pollOptions);
  const [votedPollId, setVotedPollId] = useState<string | null>(initial.votedPollId);
  const [b2bQuotes, setB2bQuotes] = useState<B2BQuoteRecord[]>(initial.b2bQuotes);

  const [studioConfig, setStudioConfig] = useState<CustomConfig>({
    category: 'phone',
    mode: 'custom',
    material: 'impact-polymer',
    primaryColor: '#1E293B',
    accentColor: '#2563EB',
    pattern: 'topographic',
    engraving: '',
    designerEditionId: null,
  });

  useEffect(() => {
    const payload: PersistedState = {
      activeSegment,
      cart,
      registeredGear,
      warrantyClaims,
      habitLogs,
      newsletter,
      rsvpEventIds,
      pollOptions,
      votedPollId,
      b2bQuotes,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [
    activeSegment,
    cart,
    registeredGear,
    warrantyClaims,
    habitLogs,
    newsletter,
    rsvpEventIds,
    pollOptions,
    votedPollId,
    b2bQuotes,
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const totalBagCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleAddToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    setCart((prev) => [
      ...prev,
      {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        quantity: 1,
      },
    ]);
    showToast(`Added ${item.title} to your bag.`);
  };

  const handleAddCategoriesKit = (categories: ProductCategory[]) => {
    const newItems: CartItem[] = categories.map((cat) => {
      const spec = PRODUCT_SPECS[cat];
      return {
        id: `kit-${cat}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        category: cat,
        title: `${spec.name} (Holistic Kit)`,
        mode: 'custom',
        materialName: 'ImpactFlex Polymer',
        primaryColor: studioConfig.primaryColor,
        accentColor: studioConfig.accentColor,
        pattern: 'solid',
        engraving: '',
        unitPrice: spec.basePrice,
        quantity: 1,
      };
    });
    setCart((prev) => [...prev, ...newItems]);
    setCartOpen(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCompleteOrder = () => {
    const orderNumber = `CA-${Math.floor(10000 + Math.random() * 89999)}`;
    const todayIso = '2026-11-13';
    const newlyRegistered: RegisteredGear[] = cart.map((item) => ({
      id: `gear-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      serialCode: `CA-${item.category.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 89999)}`,
      category: item.category,
      productTitle: item.title,
      purchaseDate: todayIso,
      warrantyDaysRemaining: 365,
      status: 'Active Coverage',
      colorHex: item.primaryColor,
      lastCheckInDate: todayIso,
    }));
    setRegisteredGear((prev) => [...newlyRegistered, ...prev]);
    setCart([]);
    return orderNumber;
  };

  const handleLogTodayHabit = (field: 'hydrationMet' | 'activeCarryMet' | 'socialShared') => {
    setHabitLogs((prev) => {
      const next = [...prev];
      const idx = next.length - 1;
      if (idx < 0) return prev;
      const current = next[idx];
      const updated = { ...current, [field]: !current[field] };
      const score =
        30 +
        (updated.hydrationMet ? 30 : 0) +
        (updated.activeCarryMet ? 25 : 0) +
        (updated.socialShared ? 15 : 0);
      next[idx] = { ...updated, score };
      return next;
    });
  };

  const handleRegisterGear = (item: {
    category: ProductCategory;
    productTitle: string;
    serialCode: string;
  }) => {
    const entry: RegisteredGear = {
      id: `gear-${Date.now()}`,
      serialCode: item.serialCode,
      category: item.category,
      productTitle: item.productTitle,
      purchaseDate: '2026-11-13',
      warrantyDaysRemaining: 365,
      status: 'Active Coverage',
      colorHex: '#2563EB',
      lastCheckInDate: '2026-11-13',
    };
    setRegisteredGear((prev) => [entry, ...prev]);
  };

  const handleSubmitClaim = (claim: {
    gearId: string;
    defectType: string;
    description: string;
  }) => {
    const gear = registeredGear.find((g) => g.id === claim.gearId);
    if (!gear) return;
    const newClaim: WarrantyClaim = {
      id: `clm-${Date.now()}`,
      gearId: gear.id,
      serialCode: gear.serialCode,
      productTitle: gear.productTitle,
      defectType: claim.defectType,
      description: claim.description,
      submittedAt: 'Nov 13, 2026',
      status: 'Submitted',
    };
    setWarrantyClaims((prev) => [newClaim, ...prev]);
    setRegisteredGear((prev) =>
      prev.map((g) => (g.id === gear.id ? { ...g, status: 'Claim Under Review' } : g))
    );
  };

  const handleToggleRsvp = (eventId: string) => {
    setRsvpEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleVotePoll = (optionId: string) => {
    setPollOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === optionId && votedPollId !== optionId) {
          return { ...opt, votes: opt.votes + 1 };
        }
        if (opt.id === votedPollId && votedPollId !== optionId) {
          return { ...opt, votes: Math.max(0, opt.votes - 1) };
        }
        return opt;
      })
    );
    setVotedPollId(optionId);
  };

  const handleSubmitB2BQuote = (quote: Omit<B2BQuoteRecord, 'id' | 'submittedAt'>) => {
    setB2bQuotes((prev) => [
      {
        ...quote,
        id: `b2b-${Date.now()}`,
        submittedAt: 'Nov 13, 2026',
      },
      ...prev,
    ]);
  };

  const handleJumpToCustomize = (category: ProductCategory) => {
    setStudioConfig((prev) => ({
      ...prev,
      category,
      mode: 'custom',
      designerEditionId: null,
    }));
    setActiveTab('studio');
    setTimeout(() => {
      document.getElementById('custom-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const [showPromoStrip, setShowPromoStrip] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#14221B]">
      {/* Slim Dismissible Storefront Announcement (<= 36px) */}
      {showPromoStrip && (
        <div className="bg-[#14221B] text-[#FAFAF7] px-4 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <span className="truncate flex-1 text-center">
              Free 1-Year Manufacturing Defect Warranty on every custom build · Bundle 3+ items for 15% off
            </span>
            <button
              type="button"
              onClick={() => setShowPromoStrip(false)}
              className="p-1 text-[#A7B5AC] hover:text-white cursor-pointer shrink-0"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Bar Contract: [Brand title] — [4-5 concise single-line nav links] — [1 primary action] */}
      <header className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#E4E7DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className="font-display text-xl font-bold tracking-tight text-[#14221B] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cadence Armor
          </button>

          {/* Zone 2: 5 Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                    active
                      ? 'text-[#14221B] border-[#EA580C]'
                      : 'text-[#4A5D52] border-transparent hover:text-[#14221B]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#14221B] rounded-xl hover:bg-[#23382C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums">Bag ({totalBagCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-[#4A5D52] hover:text-[#14221B] rounded-lg cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-[#E4E7DF] bg-[#FAFAF7] px-4 py-3 flex flex-wrap gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs font-medium rounded-xl whitespace-nowrap cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#14221B] text-white'
                    : 'bg-[#EDEAE2] text-[#14221B]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {activeTab === 'studio' && (
          <StudioView
            activeSegment={activeSegment}
            onSelectSegment={setActiveSegment}
            config={studioConfig}
            onUpdateConfig={setStudioConfig}
            onAddToCart={handleAddToCart}
            onAddHolisticBundle={() =>
              handleAddCategoriesKit(['phone', 'earbuds', 'laptop', 'bottle'])
            }
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'lifestyle' && (
          <LifestyleHubView
            activeSegment={activeSegment}
            onSelectSegment={setActiveSegment}
            habitLogs={habitLogs}
            onLogTodayHabit={handleLogTodayHabit}
            newsletter={newsletter}
            onUpdateNewsletter={setNewsletter}
            onJumpToCategory={handleJumpToCustomize}
            onAddSegmentKit={handleAddCategoriesKit}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            activeSegment={activeSegment}
            registeredGear={registeredGear}
            habitLogs={habitLogs}
            newsletter={newsletter}
            onNavigateTab={setActiveTab}
            onJumpToCustomize={handleJumpToCustomize}
          />
        )}

        {activeTab === 'partners' && (
          <PartnersEventsView
            rsvpEventIds={rsvpEventIds}
            onToggleRsvp={handleToggleRsvp}
            pollOptions={pollOptions}
            votedPollId={votedPollId}
            onVotePoll={handleVotePoll}
            b2bQuotes={b2bQuotes}
            onSubmitB2BQuote={handleSubmitB2BQuote}
          />
        )}

        {activeTab === 'warranty' && (
          <WarrantyView
            registeredGear={registeredGear}
            warrantyClaims={warrantyClaims}
            onRegisterGear={handleRegisterGear}
            onSubmitClaim={handleSubmitClaim}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#E4E7DF] bg-white mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#4A5D52]">
          <div>
            <span className="font-semibold text-[#14221B]">Cadence Armor</span> · Custom protection for phones, earbuds, laptops &amp; bottles · 1-year manufacturing defect warranty
          </div>
          <div className="flex flex-wrap items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#14221B] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        activeSegment={activeSegment}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onCompleteOrder={handleCompleteOrder}
        onViewWarranty={() => setActiveTab('warranty')}
      />

      {/* Quick Bag Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#14221B] text-white px-4 py-3 rounded-xl text-xs font-medium shadow-lg flex items-center gap-3">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setCartOpen(true);
            }}
            className="text-[#FB923C] font-semibold hover:underline cursor-pointer"
          >
            Open Bag
          </button>
        </div>
      )}
    </div>
  );
}
