import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Layers, ShieldCheck, Shuffle, Sliders, Sparkles } from 'lucide-react';
import {
  COLOR_OPTIONS,
  CUSTOMER_SEGMENTS,
  DESIGNER_EDITIONS,
  LIFESTYLE_MOOD_PRESETS,
  MATERIAL_OPTIONS,
  PATTERN_OPTIONS,
  PRODUCT_SPECS,
} from '../data/businessData';
import {
  CartItem,
  CustomConfig,
  DesignMode,
  DesignerEdition,
  ProductCategory,
  SegmentId,
} from '../types/businessModel';
import { ProductPreviewSvg } from './ProductPreviewSvg';

interface StudioViewProps {
  activeSegment: SegmentId;
  onSelectSegment: (segment: SegmentId) => void;
  config: CustomConfig;
  onUpdateConfig: (updater: (prev: CustomConfig) => CustomConfig) => void;
  onAddToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  onAddHolisticBundle: () => void;
  onNavigateTab: (tab: 'lifestyle' | 'analytics' | 'warranty') => void;
}

const CATEGORIES: ProductCategory[] = ['phone', 'earbuds', 'laptop', 'bottle'];

const BACKDROP_SCENES = [
  { id: 'chalk', label: 'Sunlit Chalk', className: 'bg-gradient-to-br from-[#F7F6F1] via-[#F2F4EF] to-[#E6EFE8] text-[#14221B]' },
  { id: 'citrus', label: 'Trail Dawn', className: 'bg-gradient-to-br from-[#FFEDD5] via-[#FEF3C7] to-[#FCE7F3] text-[#14221B]' },
  { id: 'sky', label: 'Coastal Air', className: 'bg-gradient-to-br from-[#E0F2FE] via-[#DBEAFE] to-[#ECFDF5] text-[#14221B]' },
  { id: 'turf', label: 'Night Gym', className: 'bg-gradient-to-br from-[#1B3B2B] via-[#14221B] to-[#0F1F18] text-[#FAFAF7]' },
];

const STRESS_TESTS = [
  {
    id: 'drop',
    label: '3.0m Trail Drop',
    metric: '98.4% Shock Dispersed',
    detail: 'Dual-density corner air pockets redirect asphalt impact energy away from glass and chassis seams.',
  },
  {
    id: 'sweat',
    label: 'Sweaty HIIT Set',
    metric: 'High-Friction Wet Grip',
    detail: 'Micro-textured side rails and moisture-wicking elastomer prevent bench and dumbbell slips.',
  },
  {
    id: 'hydration',
    label: '24h Cold Hydration',
    metric: '316 Double-Wall Steel',
    detail: 'Partner-crafted vacuum vessel keeps electrolytes cold for 24 hours with a dent-proof silicone boot.',
  },
  {
    id: 'backpack',
    label: 'Backpack Crush',
    metric: '360° Suspended Cradle',
    detail: 'Ribbed edge channels absorb textbook and commuter bag pressure without bending device frames.',
  },
];

const SEGMENT_GRADIENTS: Record<SegmentId, string> = {
  students: 'from-[#DBEAFE] via-[#E0F2FE] to-[#ECFDF5]',
  office: 'from-[#D1FAE5] via-[#ECFDF5] to-[#F3F4F6]',
  gym: 'from-[#FCE7F3] via-[#FFEDD5] to-[#FEF3C7]',
  runners: 'from-[#FFEDD5] via-[#FEF3C7] to-[#D1FAE5]',
  children: 'from-[#FEF9C3] via-[#E0F2FE] to-[#FCE7F3]',
};

export const StudioView: React.FC<StudioViewProps> = ({
  activeSegment,
  onSelectSegment,
  config,
  onUpdateConfig,
  onAddToCart,
  onAddHolisticBundle,
  onNavigateTab,
}) => {
  const [activeMoodId, setActiveMoodId] = useState<string>(LIFESTYLE_MOOD_PRESETS[0].id);
  const [sceneId, setSceneId] = useState<string>('citrus');
  const [showLayers, setShowLayers] = useState<boolean>(false);
  const [activeStressId, setActiveStressId] = useState<string>('drop');

  const segmentData = useMemo(
    () => CUSTOMER_SEGMENTS.find((s) => s.id === activeSegment) ?? CUSTOMER_SEGMENTS[0],
    [activeSegment]
  );

  const activeMood = useMemo(
    () => LIFESTYLE_MOOD_PRESETS.find((m) => m.id === activeMoodId) ?? LIFESTYLE_MOOD_PRESETS[0],
    [activeMoodId]
  );

  const activeScene = useMemo(
    () => BACKDROP_SCENES.find((s) => s.id === sceneId) ?? BACKDROP_SCENES[0],
    [sceneId]
  );

  const activeStress = useMemo(
    () => STRESS_TESTS.find((t) => t.id === activeStressId) ?? STRESS_TESTS[0],
    [activeStressId]
  );

  const activeSpec = PRODUCT_SPECS[config.category];
  const activeMaterial = useMemo(
    () => MATERIAL_OPTIONS.find((m) => m.id === config.material) ?? MATERIAL_OPTIONS[0],
    [config.material]
  );
  const activePattern = useMemo(
    () => PATTERN_OPTIONS.find((p) => p.id === config.pattern) ?? PATTERN_OPTIONS[0],
    [config.pattern]
  );
  const activeDesigner = useMemo(
    () => DESIGNER_EDITIONS.find((d) => d.id === config.designerEditionId) ?? null,
    [config.designerEditionId]
  );

  const computedPrice = useMemo(() => {
    const designerUpcharge = config.mode === 'designer' && activeDesigner ? activeDesigner.priceDelta : 0;
    const engravingFee = config.engraving.trim().length > 0 ? 5 : 0;
    return activeSpec.basePrice + activeMaterial.priceDelta + activePattern.priceDelta + designerUpcharge + engravingFee;
  }, [activeSpec, activeMaterial, activePattern, config.mode, config.engraving, activeDesigner]);

  const bundleTotalRegular = useMemo(
    () => CATEGORIES.reduce((sum, cat) => sum + PRODUCT_SPECS[cat].basePrice, 0),
    []
  );
  const bundleDiscountedPrice = Math.round(bundleTotalRegular * 0.85);

  const handleApplyMood = (moodId: string) => {
    const mood = LIFESTYLE_MOOD_PRESETS.find((m) => m.id === moodId);
    if (!mood) return;
    setActiveMoodId(mood.id);
    onUpdateConfig((prev) => ({
      ...prev,
      mode: 'custom',
      designerEditionId: null,
      primaryColor: mood.primaryColor,
      accentColor: mood.accentColor,
      pattern: mood.pattern,
      material: mood.material,
    }));
  };

  const handleShuffleColors = () => {
    const primaryIdx = Math.floor(Math.random() * COLOR_OPTIONS.length);
    let accentIdx = Math.floor(Math.random() * COLOR_OPTIONS.length);
    if (accentIdx === primaryIdx) {
      accentIdx = (primaryIdx + 2) % COLOR_OPTIONS.length;
    }
    const patIdx = Math.floor(Math.random() * PATTERN_OPTIONS.length);
    onUpdateConfig((prev) => ({
      ...prev,
      mode: 'custom',
      designerEditionId: null,
      primaryColor: COLOR_OPTIONS[primaryIdx].hex,
      accentColor: COLOR_OPTIONS[accentIdx].hex,
      pattern: PATTERN_OPTIONS[patIdx].id,
    }));
  };

  const applyDesignerEdition = (edition: DesignerEdition) => {
    onUpdateConfig((prev) => ({
      ...prev,
      category: edition.category,
      mode: 'designer',
      primaryColor: edition.primaryColor,
      accentColor: edition.accentColor,
      material: edition.material,
      pattern: edition.pattern,
      designerEditionId: edition.id,
    }));
    document.getElementById('custom-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleModeSwitch = (mode: DesignMode) => {
    if (mode === 'designer') {
      const match =
        DESIGNER_EDITIONS.find((d) => d.category === config.category) ??
        DESIGNER_EDITIONS.find((d) => d.segmentFit === activeSegment) ??
        DESIGNER_EDITIONS[0];
      onUpdateConfig((prev) => ({
        ...prev,
        mode: 'designer',
        category: match.category,
        primaryColor: match.primaryColor,
        accentColor: match.accentColor,
        material: match.material,
        pattern: match.pattern,
        designerEditionId: match.id,
      }));
    } else {
      onUpdateConfig((prev) => ({
        ...prev,
        mode: 'custom',
        designerEditionId: null,
      }));
    }
  };

  const handleAddConfiguredItem = () => {
    onAddToCart({
      category: config.category,
      title:
        config.mode === 'designer' && activeDesigner
          ? `${activeSpec.name} — ${activeDesigner.name}`
          : `${activeSpec.name} (Custom Build)`,
      mode: config.mode,
      materialName: activeMaterial.name,
      primaryColor: config.primaryColor,
      accentColor: config.accentColor,
      pattern: config.pattern,
      engraving: config.engraving.trim().toUpperCase(),
      designerName: config.mode === 'designer' && activeDesigner ? activeDesigner.kolName : undefined,
      unitPrice: computedPrice,
    });
  };

  return (
    <div className="space-y-16">
      {/* Vibrant B2C Hero: Editorial Copy + Strictly Contained 4-Piece Color Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 min-w-0 flex flex-col justify-between py-2 sm:py-4 space-y-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#4A5D52]">
              <span>Custom Active Protection</span>
              <span aria-hidden="true">·</span>
              <span>316 Steel Hydration</span>
              <span aria-hidden="true">·</span>
              <span>1-Year Defect Warranty</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-[#14221B] text-balance leading-[1.06]">
              Gear designed by you for every mile, set, and sip.
            </h1>

            <p className="text-base sm:text-lg text-[#4A5D52] leading-relaxed max-w-xl">
              Personalize sweat-grip phone cases, latched earbud shells, ribbed laptop sleeves, and insulated hydration bottles in vibrant colorways built for healthy movement.
            </p>

            {/* Interactive Mood Palette Switcher */}
            <div className="pt-1 space-y-3">
              <div className="text-xs font-semibold text-[#14221B]">
                Try a matching 4-piece color mood
              </div>
              <div className="flex flex-wrap gap-2">
                {LIFESTYLE_MOOD_PRESETS.map((mood) => {
                  const selected = activeMoodId === mood.id;
                  return (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => handleApplyMood(mood.id)}
                      className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#14221B] text-white border-[#14221B] shadow-sm'
                          : 'bg-white text-[#14221B] border-[#E0E4DC] hover:border-[#10B981]'
                      }`}
                    >
                      <span className="flex items-center -space-x-1 shrink-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/80"
                          style={{ backgroundColor: mood.primaryColor }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/80"
                          style={{ backgroundColor: mood.accentColor }}
                        />
                      </span>
                      <span className="whitespace-nowrap">{mood.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#4A5D52]">{activeMood.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#custom-studio"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#EA580C] rounded-xl hover:bg-[#C2410C] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Customize Your Gear</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onAddHolisticBundle}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#14221B] bg-[#EDEAE2] rounded-xl hover:bg-[#E2DDD2] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Shop 4-Piece Kit · ${bundleDiscountedPrice}</span>
            </button>
          </div>
        </div>

        {/* Hero Right: Colorful 4-Piece Showcase (Strictly Contained Grid) */}
        <div
          className={`lg:col-span-6 min-w-0 rounded-2xl bg-gradient-to-br ${activeMood.backdropClass} border border-[#E2E6DD] p-5 sm:p-7 flex flex-col justify-between overflow-hidden`}
        >
          <div className="flex items-center justify-between gap-2 text-xs text-[#4A5D52]">
            <span className="font-semibold text-[#14221B]">{activeMood.name} Collection</span>
            <span>Tap any item to customize</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 my-5">
            {CATEGORIES.map((cat) => {
              const spec = PRODUCT_SPECS[cat];
              const isSelected = config.category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onUpdateConfig((prev) => ({
                      ...prev,
                      category: cat,
                      mode: 'custom',
                      designerEditionId: null,
                    }));
                    document.getElementById('custom-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`min-w-0 text-left bg-white/90 backdrop-blur-sm rounded-xl p-3.5 border transition-all hover:-translate-y-0.5 cursor-pointer overflow-hidden ${
                    isSelected ? 'border-[#15803D] ring-1 ring-[#15803D]/30' : 'border-white hover:border-[#10B981]'
                  }`}
                >
                  <div className="h-32 sm:h-36 w-full overflow-hidden flex items-center justify-center p-1">
                    <ProductPreviewSvg
                      category={cat}
                      primaryColor={config.primaryColor}
                      accentColor={config.accentColor}
                      material={config.material}
                      pattern={config.pattern}
                      engraving={config.engraving}
                      className="w-full h-full max-w-full max-h-full block"
                    />
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#ECEEE8] flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-[#14221B] truncate">{spec.shortName}</span>
                    <span className="text-xs font-mono tabular-nums text-[#4A5D52] shrink-0">${spec.basePrice}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4A5D52] border-t border-[#14221B]/10 pt-3.5">
            <span>Drop-tested protection · Sweat-ready grip · BPA-free 316 steel</span>
            <button
              type="button"
              onClick={() => onNavigateTab('lifestyle')}
              className="font-semibold text-[#15803D] hover:underline cursor-pointer whitespace-nowrap"
            >
              Match to your routine →
            </button>
          </div>
        </div>
      </section>

      {/* Interactive "Design Yours" Studio */}
      <section id="custom-studio" className="bg-white border border-[#E4E7DF] rounded-2xl p-6 sm:p-10 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#EAECE6]">
          <div className="min-w-0">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#14221B]">
              Design Yours Studio
            </h2>
            <p className="text-sm text-[#4A5D52] mt-1">
              Mix vibrant colorways, tactile materials, laser engraving, or switch to a limited KOL Designer Series.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F2F4EF] rounded-xl w-fit shrink-0">
            <button
              type="button"
              onClick={() => handleModeSwitch('custom')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                config.mode === 'custom'
                  ? 'bg-white text-[#14221B] shadow-sm'
                  : 'text-[#4A5D52] hover:text-[#14221B]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom By You</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('designer')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                config.mode === 'designer'
                  ? 'bg-white text-[#14221B] shadow-sm'
                  : 'text-[#4A5D52] hover:text-[#14221B]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Designer Series</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-8 items-start">
          {/* Left: Interactive Pedestal + Environment Switcher + Stress Lab */}
          <div className="lg:col-span-6 min-w-0 space-y-5">
            <div className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-colors overflow-hidden ${activeScene.className}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs opacity-85">
                <span className="font-semibold">{activeSpec.name} · {activeMaterial.name}</span>
                <button
                  type="button"
                  onClick={() => setShowLayers((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    showLayers
                      ? 'bg-[#15803D] text-white'
                      : 'bg-white/80 text-[#14221B] hover:bg-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{showLayers ? 'Hide Protection Layers' : 'Inspect Protection Layers'}</span>
                </button>
              </div>

              <div className="my-5 h-72 sm:h-80 w-full overflow-hidden flex items-center justify-center">
                <ProductPreviewSvg
                  category={config.category}
                  primaryColor={config.primaryColor}
                  accentColor={config.accentColor}
                  material={config.material}
                  pattern={config.pattern}
                  engraving={config.engraving}
                  showProtectionLayers={showLayers}
                  className="w-full h-full max-w-full max-h-full block"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs opacity-90 pt-4 border-t border-current/15">
                <span className="font-mono tabular-nums">{activeSpec.dropRating} · {activeSpec.weight}</span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('warranty')}
                  className="inline-flex items-center gap-1.5 font-semibold hover:underline cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>1-Year Defect Warranty</span>
                </button>
              </div>
            </div>

            {/* Scene Environment Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#4A5D52]">Backdrop mood:</span>
              <div className="flex flex-wrap gap-1.5">
                {BACKDROP_SCENES.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSceneId(sc.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      sceneId === sc.id
                        ? 'bg-[#14221B] text-white border-[#14221B]'
                        : 'bg-[#FAFAF7] text-[#4A5D52] border-[#E0E4DC] hover:text-[#14221B]'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Active Lifestyle Stress Simulator */}
            <div className="bg-[#F6F8F4] border border-[#E4E7DF] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#14221B]">
                  Interactive Performance Check
                </span>
                <span className="text-xs font-mono font-semibold text-[#15803D]">
                  {activeStress.metric}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {STRESS_TESTS.map((test) => (
                  <button
                    key={test.id}
                    type="button"
                    onClick={() => setActiveStressId(test.id)}
                    className={`px-2.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer truncate ${
                      activeStressId === test.id
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white text-[#4A5D52] border border-[#E0E4DC] hover:text-[#14221B]'
                    }`}
                  >
                    {test.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#4A5D52] leading-relaxed">
                {activeStress.detail}
              </p>
            </div>
          </div>

          {/* Right: Tactile Customizer Controls */}
          <div className="lg:col-span-6 min-w-0 space-y-6">
            {/* Step 1: Protected Item */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-[#14221B]">1. Choose Gear to Customize</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      onUpdateConfig((prev) => ({
                        ...prev,
                        category: cat,
                        mode: 'custom',
                        designerEditionId: null,
                      }))
                    }
                    className={`px-3 py-2.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer truncate ${
                      config.category === cat
                        ? 'bg-[#14221B] text-white border-[#14221B]'
                        : 'bg-[#FAFAF7] text-[#14221B] border-[#E0E4DC] hover:border-[#10B981]'
                    }`}
                  >
                    {PRODUCT_SPECS[cat].shortName} · ${PRODUCT_SPECS[cat].basePrice}
                  </button>
                ))}
              </div>
            </div>

            {config.mode === 'designer' ? (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#14221B]">2. Select Creator Edition</div>
                <div className="space-y-2.5">
                  {DESIGNER_EDITIONS.map((edition) => {
                    const selected = config.designerEditionId === edition.id;
                    return (
                      <button
                        key={edition.id}
                        type="button"
                        onClick={() => applyDesignerEdition(edition)}
                        className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#15803D] bg-[#F2F7F3]'
                            : 'border-[#E4E7DF] bg-[#FAFAF7] hover:border-[#10B981]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="flex -space-x-1 shrink-0">
                              <span
                                className="w-4 h-4 rounded-full border border-white"
                                style={{ backgroundColor: edition.primaryColor }}
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-white"
                                style={{ backgroundColor: edition.accentColor }}
                              />
                            </span>
                            <span className="text-sm font-semibold text-[#14221B] truncate">
                              {edition.name}
                            </span>
                          </div>
                          <span className="text-xs font-mono tabular-nums text-[#4A5D52] shrink-0">
                            +${edition.priceDelta} · {PRODUCT_SPECS[edition.category].shortName}
                          </span>
                        </div>
                        <div className="text-xs text-[#4A5D52] mt-1.5">
                          By {edition.kolName} ({edition.kolRole}) · {edition.editionRun}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {/* Step 2 & 3: Vibrant 8-Swatch Grid + Shuffle Button */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#14221B]">
                      2. Colorway Palette
                    </span>
                    <button
                      type="button"
                      onClick={handleShuffleColors}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#14221B] bg-[#F2F4EF] rounded-lg hover:bg-[#E5E9E0] transition-colors cursor-pointer"
                    >
                      <Shuffle className="w-3.5 h-3.5 text-[#EA580C]" />
                      <span>Surprise Mix</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#4A5D52]">Shell Shade</span>
                        <span className="font-semibold text-[#14221B]">
                          {COLOR_OPTIONS.find((c) => c.hex === config.primaryColor)?.name ?? 'Custom'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2.5 w-fit">
                        {COLOR_OPTIONS.map((col) => (
                          <button
                            key={col.id}
                            type="button"
                            title={col.name}
                            aria-label={`Shell color ${col.name}`}
                            onClick={() => onUpdateConfig((prev) => ({ ...prev, primaryColor: col.hex }))}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-transform cursor-pointer ${
                              config.primaryColor === col.hex
                                ? 'ring-2 ring-[#15803D] ring-offset-2 border-[#14221B] scale-105'
                                : 'border-[#D5DAD0] hover:scale-105'
                            }`}
                            style={{ backgroundColor: col.hex }}
                          >
                            {config.primaryColor === col.hex && (
                              <Check className="w-4 h-4" style={{ color: col.contrastText }} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#4A5D52]">Bumper &amp; Trim</span>
                        <span className="font-semibold text-[#14221B]">
                          {COLOR_OPTIONS.find((c) => c.hex === config.accentColor)?.name ?? 'Custom'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2.5 w-fit">
                        {COLOR_OPTIONS.map((col) => (
                          <button
                            key={col.id}
                            type="button"
                            title={col.name}
                            aria-label={`Accent color ${col.name}`}
                            onClick={() => onUpdateConfig((prev) => ({ ...prev, accentColor: col.hex }))}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-transform cursor-pointer ${
                              config.accentColor === col.hex
                                ? 'ring-2 ring-[#15803D] ring-offset-2 border-[#14221B] scale-105'
                                : 'border-[#D5DAD0] hover:scale-105'
                            }`}
                            style={{ backgroundColor: col.hex }}
                          >
                            {config.accentColor === col.hex && (
                              <Check className="w-4 h-4" style={{ color: col.contrastText }} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Material Finish */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-[#14221B]">3. Tactile Material Finish</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {MATERIAL_OPTIONS.map((mat) => {
                      const active = config.material === mat.id;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => onUpdateConfig((prev) => ({ ...prev, material: mat.id }))}
                          className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                            active
                              ? 'border-[#15803D] bg-[#F2F7F3]'
                              : 'border-[#E4E7DF] bg-[#FAFAF7] hover:border-[#10B981]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#14221B]">
                            <span>{mat.name}</span>
                            <span className="font-mono tabular-nums text-[#4A5D52] shrink-0">
                              {mat.priceDelta === 0 ? 'Included' : `+$${mat.priceDelta}`}
                            </span>
                          </div>
                          <div className="text-xs text-[#4A5D52] mt-1 leading-snug">
                            {mat.finishDescription}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 4: Surface Pattern */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-[#14221B]">4. Grip Texture &amp; Pattern</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PATTERN_OPTIONS.map((pat) => (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => onUpdateConfig((prev) => ({ ...prev, pattern: pat.id }))}
                        className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer truncate ${
                          config.pattern === pat.id
                            ? 'bg-[#14221B] text-white border-[#14221B]'
                            : 'bg-[#FAFAF7] text-[#14221B] border-[#E0E4DC] hover:border-[#10B981]'
                        }`}
                      >
                        {pat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Personal Laser Engraving */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="engraving-input" className="text-xs font-semibold text-[#14221B]">
                  5. Personal Laser Engraving (Optional · +$5)
                </label>
                <span className="text-xs font-mono text-[#64746B]">
                  {config.engraving.length}/10 chars
                </span>
              </div>
              <input
                id="engraving-input"
                type="text"
                maxLength={10}
                value={config.engraving}
                onChange={(e) => onUpdateConfig((prev) => ({ ...prev, engraving: e.target.value }))}
                placeholder="Type your initials, run club, or mantra"
                className="w-full px-4 py-3 text-sm font-mono uppercase bg-[#FAFAF7] border border-[#DCE0D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#15803D]"
              />
            </div>

            {/* Contiguous Purchase Module */}
            <div className="pt-5 border-t border-[#EAECE6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-xs text-[#4A5D52]">
                  Ships custom-finished in 48h · 1-Yr Warranty
                </div>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="font-mono tabular-nums text-2xl font-bold text-[#14221B]">
                    ${computedPrice}
                  </span>
                  <span className="text-xs text-[#15803D] font-medium">
                    Bundle 3+ items for 15% off
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddConfiguredItem}
                className="px-7 py-3.5 text-sm font-semibold text-white bg-[#EA580C] rounded-xl hover:bg-[#C2410C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Add to Bag — ${computedPrice}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Colorful Shop by Healthy Routine Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#14221B]">
              Shop by Healthy Routine
            </h2>
            <p className="text-sm text-[#4A5D52] mt-1">
              Select your lifestyle to tailor kit recommendations and daily hydration tracking.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('lifestyle')}
            className="text-sm font-semibold text-[#15803D] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Daily Wellness Club →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CUSTOMER_SEGMENTS.map((seg) => {
            const active = seg.id === activeSegment;
            const gradient = SEGMENT_GRADIENTS[seg.id];
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => onSelectSegment(seg.id)}
                className={`min-w-0 text-left rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                  active
                    ? 'bg-[#14221B] text-white border-[#14221B]'
                    : 'bg-white text-[#14221B] border-[#E4E7DF] hover:border-[#10B981]'
                }`}
              >
                <div className={`h-3 w-full bg-gradient-to-r ${gradient}`} />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="font-display text-lg font-bold">{seg.name}</div>
                    <p
                      className={`text-xs mt-1.5 leading-relaxed ${
                        active ? 'text-[#D3DDD6]' : 'text-[#4A5D52]'
                      }`}
                    >
                      {seg.tagline}
                    </p>
                  </div>
                  <div
                    className={`mt-4 pt-3 border-t text-xs font-medium ${
                      active ? 'border-white/15 text-[#A7F3D0]' : 'border-[#EAECE6] text-[#15803D]'
                    }`}
                  >
                    {seg.recommendedCategories.map((c) => PRODUCT_SPECS[c].shortName).join(' · ')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-[#4A5D52]">
          Active profile: <span className="font-semibold text-[#14221B]">{segmentData.name}</span> — {segmentData.healthyGoal}.{' '}
          <button
            type="button"
            onClick={() => onNavigateTab('analytics')}
            className="font-semibold text-[#15803D] hover:underline cursor-pointer"
          >
            See your personalized carry insights
          </button>
        </div>
      </section>

      {/* Featured Designer Series Grid (Strictly Contained Visual Stage) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#14221B]">
              Limited Designer Series
            </h2>
            <p className="text-sm text-[#4A5D52] mt-1">
              Co-created with marathoners, strength coaches, and industrial designers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESIGNER_EDITIONS.slice(0, 3).map((edition, idx) => {
            const base = PRODUCT_SPECS[edition.category];
            const total =
              base.basePrice +
              (MATERIAL_OPTIONS.find((m) => m.id === edition.material)?.priceDelta ?? 0) +
              (PATTERN_OPTIONS.find((p) => p.id === edition.pattern)?.priceDelta ?? 0) +
              edition.priceDelta;
            const stageBg =
              idx === 0
                ? 'from-[#FFEDD5] to-[#FEF3C7]'
                : idx === 1
                ? 'from-[#E0F2FE] to-[#ECFDF5]'
                : 'from-[#FCE7F3] to-[#F3E8FF]';
            return (
              <div
                key={edition.id}
                className="min-w-0 bg-white border border-[#E4E7DF] rounded-2xl p-6 flex flex-col justify-between transition-transform hover:-translate-y-0.5 overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#4A5D52]">
                    <span className="truncate">{edition.kolName} · {edition.editionRun}</span>
                  </div>

                  <div className={`my-5 h-52 w-full bg-gradient-to-br ${stageBg} rounded-xl p-4 flex items-center justify-center overflow-hidden`}>
                    <ProductPreviewSvg
                      category={edition.category}
                      primaryColor={edition.primaryColor}
                      accentColor={edition.accentColor}
                      material={edition.material}
                      pattern={edition.pattern}
                      engraving=""
                      className="w-full h-full max-w-full max-h-full block"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-[#14221B] truncate">
                      {edition.name}
                    </h3>
                    <span className="flex items-center gap-1 shrink-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-[#D5DAD0]"
                        style={{ backgroundColor: edition.primaryColor }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-[#D5DAD0]"
                        style={{ backgroundColor: edition.accentColor }}
                      />
                    </span>
                  </div>
                  <p className="text-sm text-[#4A5D52] mt-1.5 leading-relaxed">
                    {edition.story}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#EAECE6] flex items-center justify-between gap-3">
                  <span className="font-mono tabular-nums text-base font-bold text-[#14221B]">
                    ${total}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => applyDesignerEdition(edition)}
                      className="px-3.5 py-2 text-xs font-semibold text-[#14221B] bg-[#F2F4EF] rounded-xl hover:bg-[#E5E9E0] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Customize
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onAddToCart({
                          category: edition.category,
                          title: `${base.name} — ${edition.name}`,
                          mode: 'designer',
                          materialName:
                            MATERIAL_OPTIONS.find((m) => m.id === edition.material)?.name ?? 'ImpactFlex Polymer',
                          primaryColor: edition.primaryColor,
                          accentColor: edition.accentColor,
                          pattern: edition.pattern,
                          engraving: '',
                          designerName: edition.kolName,
                          unitPrice: total,
                        })
                      }
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#14221B] rounded-xl hover:bg-[#23382C] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
