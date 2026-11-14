import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Eye, X } from 'lucide-react';
import {
  CHANNEL_PERFORMANCE,
  COST_STRUCTURE_ITEMS,
  CUSTOMER_SEGMENTS,
  MONTHLY_REVENUE_SERIES,
  PRODUCT_SPECS,
} from '../data/businessData';
import {
  DailyHabitLog,
  NavTab,
  NewsletterState,
  ProductCategory,
  RegisteredGear,
  SegmentId,
} from '../types/businessModel';

interface AnalyticsViewProps {
  activeSegment: SegmentId;
  registeredGear: RegisteredGear[];
  habitLogs: DailyHabitLog[];
  newsletter: NewsletterState;
  onNavigateTab: (tab: NavTab) => void;
  onJumpToCustomize: (category: ProductCategory) => void;
}

type AnalyticsSubView = 'personal' | 'business';

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  activeSegment,
  registeredGear,
  habitLogs,
  newsletter,
  onNavigateTab,
  onJumpToCustomize,
}) => {
  const [subView, setSubView] = useState<AnalyticsSubView>('personal');
  const [hoveredDayIdx, setHoveredDayIdx] = useState<number | null>(null);
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);
  const [b2cMonthlyUnits, setB2cMonthlyUnits] = useState(500);
  const [b2bContracts, setB2bContracts] = useState(4);
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);

  const segmentData = useMemo(
    () => CUSTOMER_SEGMENTS.find((s) => s.id === activeSegment) ?? CUSTOMER_SEGMENTS[0],
    [activeSegment]
  );

  // Personal Metrics derived from live state
  const coveredCategories = useMemo(() => {
    const set = new Set<ProductCategory>();
    registeredGear.forEach((g) => set.add(g.category));
    return set;
  }, [registeredGear]);

  const missingRecommended = useMemo(
    () => segmentData.recommendedCategories.filter((cat) => !coveredCategories.has(cat)),
    [segmentData, coveredCategories]
  );

  const avgHabitScore = useMemo(() => {
    if (habitLogs.length === 0) return 0;
    const sum = habitLogs.reduce((acc, item) => acc + item.score, 0);
    return Math.round(sum / habitLogs.length);
  }, [habitLogs]);

  const hydrationCompletionPct = useMemo(() => {
    if (habitLogs.length === 0) return 0;
    const met = habitLogs.filter((l) => l.hydrationMet).length;
    return Math.round((met / habitLogs.length) * 100);
  }, [habitLogs]);

  const dropRiskReductionPct = useMemo(() => {
    const base = coveredCategories.size * 22;
    const consistencyBonus = avgHabitScore >= 80 ? 8 : 3;
    return Math.min(96, base + consistencyBonus);
  }, [coveredCategories.size, avgHabitScore]);

  const soonestExpiringGear = useMemo(() => {
    if (registeredGear.length === 0) return null;
    return [...registeredGear].sort((a, b) => a.warrantyDaysRemaining - b.warrantyDaysRemaining)[0];
  }, [registeredGear]);

  // Actionable Insights Engine
  const actionableInsights = useMemo(() => {
    const insights: Array<{
      id: string;
      priority: 'High Impact' | 'Recommended' | 'Retention Habit';
      title: string;
      metricImpact: string;
      explanation: string;
      ctaLabel: string;
      action: () => void;
    }> = [];

    if (missingRecommended.length > 0) {
      const targetCat = missingRecommended[0];
      const spec = PRODUCT_SPECS[targetCat];
      insights.push({
        id: 'missing-gear',
        priority: 'High Impact',
        title: `Protect your ${spec.shortName.toLowerCase()} for ${segmentData.name.toLowerCase()} routines`,
        metricImpact: `+22% holistic coverage`,
        explanation: `Your ${segmentData.name} profile highlights ${spec.name} as a top daily exposure point, yet none is registered in your kit.`,
        ctaLabel: `Customize ${spec.shortName}`,
        action: () => onJumpToCustomize(targetCat),
      });
    }

    const today = habitLogs[habitLogs.length - 1];
    if (today && (!today.hydrationMet || !today.activeCarryMet)) {
      insights.push({
        id: 'daily-checkin',
        priority: 'Retention Habit',
        title: 'Complete today’s hydration & active carry check-in',
        metricImpact: `${hydrationCompletionPct}% 13-day consistency`,
        explanation: `Daily social & hydration logs keep ${segmentData.name.toLowerCase()} retention 2.1x higher across 90 days.`,
        ctaLabel: 'Open Lifestyle Check-In',
        action: () => onNavigateTab('lifestyle'),
      });
    }

    if (!newsletter.subscribed) {
      insights.push({
        id: 'newsletter-optin',
        priority: 'Recommended',
        title: 'Activate Weekly Healthy Carry Digest',
        metricImpact: '+31% repeat accessory cadence',
        explanation: 'Subscribers receive weekly hydration insights, supplier care tips, and early access to limited Designer Series drops.',
        ctaLabel: 'Configure Weekly Digest',
        action: () => onNavigateTab('lifestyle'),
      });
    }

    if (soonestExpiringGear && soonestExpiringGear.warrantyDaysRemaining <= 100) {
      insights.push({
        id: 'warranty-window',
        priority: 'Recommended',
        title: `Inspect ${soonestExpiringGear.productTitle} before warranty window closes`,
        metricImpact: `${soonestExpiringGear.warrantyDaysRemaining} days left`,
        explanation: 'Your 1-year manufacturing defect warranty covers seam separation, latch fatigue, and bottle seal integrity.',
        ctaLabel: 'Review Warranty Ledger',
        action: () => onNavigateTab('warranty'),
      });
    }

    if (insights.length === 0) {
      insights.push({
        id: 'bundle-complete',
        priority: 'Retention Habit',
        title: 'Your active carry kit is operating at peak coverage',
        metricImpact: `${dropRiskReductionPct}% drop-risk reduction`,
        explanation: 'Explore upcoming pop-up store engraving sessions or corporate wellness collaborations with your local run club.',
        ctaLabel: 'View Pop-Up Events',
        action: () => onNavigateTab('partners'),
      });
    }

    return insights;
  }, [
    missingRecommended,
    segmentData,
    habitLogs,
    hydrationCompletionPct,
    newsletter.subscribed,
    soonestExpiringGear,
    dropRiskReductionPct,
    onJumpToCustomize,
    onNavigateTab,
  ]);

  // Business Intelligence Simulation derived from Canvas Numbers
  const simulatedAnnualB2C = b2cMonthlyUnits * 48 * 12; // $48 avg basket * 500 units = $24,000/mo = $288,000/yr
  const simulatedAnnualB2B = b2bContracts * 2500 * 12; // $2,500 avg school/corp contract * 4 = $10,000/mo = $120,000/yr
  const simulatedTotalRevenue = simulatedAnnualB2C + simulatedAnnualB2B;
  const fixedCostStructure = 30000;
  const grossMarginRate = 0.62;
  const estimatedNetContribution = Math.round(simulatedTotalRevenue * grossMarginRate - fixedCostStructure);

  // SVG Chart Path for Personal Habit Logs (strictly bounded inside viewBox)
  const chartWidth = 640;
  const chartHeight = 204;
  const padX = 42;
  const padY = 20;
  const bottomPad = 26;
  const innerW = chartWidth - padX * 2;
  const innerH = chartHeight - padY - bottomPad;

  const habitPoints = habitLogs.map((log, idx) => {
    const x = padX + (habitLogs.length > 1 ? (idx / (habitLogs.length - 1)) * innerW : innerW / 2);
    const y = padY + innerH - (log.score / 100) * innerH;
    return { x, y, log };
  });

  const linePath = habitPoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');
  const areaPath =
    habitPoints.length > 0
      ? `${linePath} L ${habitPoints[habitPoints.length - 1].x.toFixed(1)} ${(padY + innerH).toFixed(1)} L ${habitPoints[0].x.toFixed(1)} ${(padY + innerH).toFixed(1)} Z`
      : '';

  return (
    <div className="space-y-8">
      {/* Header & Mode Switch */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-slate-500">
            Data Analytics &amp; Business Intelligence · Retention &amp; Financial Telemetry
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 mt-1 text-balance">
            {subView === 'personal'
              ? 'Personalized Carry & Retention Insights'
              : 'Business Intelligence & Revenue Architecture'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setSubView('personal')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                subView === 'personal'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Personal Insights &amp; Retention
            </button>
            <button
              type="button"
              onClick={() => setSubView('business')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                subView === 'business'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Business Model &amp; BI ($408k)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowBlueprintModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Canvas Blueprint</span>
          </button>
        </div>
      </section>

      {subView === 'personal' ? (
        <>
          {/* 4-Column Personal KPI Strip */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">Holistic Gear Coverage</div>
              <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-slate-900">
                {coveredCategories.size} / 4 Items
              </div>
              <div className="mt-1 text-xs text-slate-600">
                {missingRecommended.length === 0
                  ? `Full ${segmentData.name} protection active`
                  : `Missing ${PRODUCT_SPECS[missingRecommended[0]].shortName}`}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">Hydration Habit Consistency</div>
              <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-slate-900">
                {hydrationCompletionPct}%
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Last {habitLogs.length} daily bottle &amp; routine logs
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">Estimated Drop Risk Reduction</div>
              <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-emerald-700">
                {dropRiskReductionPct}%
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Calculated for {segmentData.name} exposure
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">Nearest Warranty Expiration</div>
              <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-slate-900">
                {soonestExpiringGear ? `${soonestExpiringGear.warrantyDaysRemaining}d` : '—'}
              </div>
              <div className="mt-1 text-xs text-slate-600 truncate">
                {soonestExpiringGear ? soonestExpiringGear.serialCode : 'No items registered'}
              </div>
            </div>
          </section>

          {/* Chart + Actionable Insights Split */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Consistency Chart */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Healthy Lifestyle &amp; Active Carry Score
                  </h2>
                  <p className="text-xs text-slate-500">
                    Updates immediately when you log hydration or social check-ins in Lifestyle Hub.
                  </p>
                </div>
                <div className="font-mono tabular-nums text-xs font-semibold text-slate-900">
                  Avg {avgHabitScore} / 100
                </div>
              </div>

              <div className="relative overflow-hidden">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-56 block"
                  role="img"
                  aria-label="Daily healthy carry and hydration consistency chart"
                >
                  <defs>
                    <linearGradient id="habitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#15803D" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#15803D" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {[25, 50, 75, 100].map((val) => {
                    const y = padY + innerH - (val / 100) * innerH;
                    return (
                      <g key={val}>
                        <line
                          x1={padX}
                          y1={y}
                          x2={chartWidth - padX}
                          y2={y}
                          stroke="#E4E7DF"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={padX - 8}
                          y={y + 3}
                          textAnchor="end"
                          fontSize="10"
                          fontFamily="JetBrains Mono, monospace"
                          fill="#64746B"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  <path d={areaPath} fill="url(#habitAreaGrad)" />
                  <path d={linePath} fill="none" stroke="#15803D" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

                  {habitPoints.map((pt, idx) => {
                    const isHovered = hoveredDayIdx === idx;
                    return (
                      <g key={pt.log.date}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 6 : 4}
                          fill={pt.log.socialShared ? '#EA580C' : '#15803D'}
                          stroke="#FFFFFF"
                          strokeWidth="1.8"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredDayIdx(idx)}
                          onMouseLeave={() => setHoveredDayIdx(null)}
                        />
                        {(idx % 2 === 0 || idx === habitPoints.length - 1) && (
                          <text
                            x={pt.x}
                            y={chartHeight - 6}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontFamily="JetBrains Mono, monospace"
                            fill="#64746B"
                          >
                            {pt.log.label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {hoveredDayIdx !== null && habitPoints[hoveredDayIdx] && (
                  <div className="mt-2 p-3 bg-[#14221B] text-white rounded-xl text-xs flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono">{habitPoints[hoveredDayIdx].log.label}</span>
                    <span>
                      Score: <strong className="font-mono tabular-nums">{habitPoints[hoveredDayIdx].log.score}</strong>
                    </span>
                    <span>
                      Hydration: {habitPoints[hoveredDayIdx].log.hydrationMet ? 'Met' : 'Missed'}
                    </span>
                    <span>
                      Social Check-In: {habitPoints[hoveredDayIdx].log.socialShared ? 'Shared' : 'Not shared'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Personalized Actionable Insights */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Actionable Retention Insights
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Targeted next steps calculated from your {segmentData.name} profile and gear inventory.
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {actionableInsights.map((ins) => (
                  <div key={ins.id} className="py-4 first:pt-1 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span
                        className={`font-semibold ${
                          ins.priority === 'High Impact'
                            ? 'text-amber-700'
                            : ins.priority === 'Retention Habit'
                            ? 'text-blue-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {ins.priority}
                      </span>
                      <span className="font-mono tabular-nums text-slate-500">{ins.metricImpact}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{ins.title}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{ins.explanation}</p>
                    <button
                      type="button"
                      onClick={ins.action}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer pt-0.5"
                    >
                      <span>{ins.ctaLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Segment Peer Retention Benchmark Table */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Customer Segment Engagement &amp; Retention Benchmarks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                How all 5 target customer segments perform across hydration habit logs and repeat gear orders.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-2.5 pr-4">Customer Segment</th>
                    <th className="py-2.5 px-4">Core Healthy Goal</th>
                    <th className="py-2.5 px-4 text-right">90-Day Retention</th>
                    <th className="py-2.5 px-4 text-right">Repeat Order Rate</th>
                    <th className="py-2.5 pl-4 text-right">Avg Monthly Logs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {CUSTOMER_SEGMENTS.map((seg) => {
                    const isMine = seg.id === activeSegment;
                    return (
                      <tr
                        key={seg.id}
                        className={isMine ? 'bg-blue-50/50 font-medium' : 'hover:bg-slate-50'}
                      >
                        <td className="py-3 pr-4 text-slate-900">
                          {seg.name} {isMine && <span className="text-xs text-blue-600 ml-1">(Active)</span>}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">{seg.healthyGoal}</td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900">
                          {seg.avgRetentionRate}%
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900">
                          {seg.repeatOrderRate}%
                        </td>
                        <td className="py-3 pl-4 text-right font-mono tabular-nums text-slate-900">
                          {seg.avgMonthlyHydrationLogs}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        /* Business Intelligence & Canvas Economics Sub-View */
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">Total Annual Revenue Target</div>
              <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-slate-900">
                $408,000
              </div>
              <div className="mt-1 text-xs text-slate-600">$288k B2C + $120k B2B/School</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">B2C Monthly Run Rate</div>
              <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-blue-600">
                $24,000 / mo
              </div>
              <div className="mt-1 text-xs text-slate-600">$24,000 × 12 = $288,000 / yr</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">B2B / School Monthly Stream</div>
              <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-emerald-700">
                $10,000 / mo
              </div>
              <div className="mt-1 text-xs text-slate-600">$10,000 × 12 = $120,000 / yr</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">Initial Cost Structure</div>
              <div className="mt-2 font-mono tabular-nums text-2xl font-bold text-slate-900">
                $30,000
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Supplier deposit, R&amp;D, Marketing, Logistics, Ops
              </div>
            </div>
          </section>

          {/* 12-Month Stacked Revenue Chart + Interactive Unit Economics Simulator */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    12-Month Revenue Stream Breakdown
                  </h2>
                  <p className="text-xs text-slate-500">
                    B2C Direct ($288,000) vs. B2B &amp; School Bulk ($120,000)
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-xs inline-block" />
                    B2C
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs inline-block" />
                    B2B/School
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-end h-52 pt-4 border-b border-slate-200 pb-2">
                {MONTHLY_REVENUE_SERIES.map((item, idx) => {
                  const total = item.b2c + item.b2b;
                  const maxScale = 42000;
                  const b2cHeightPct = Math.round((item.b2c / maxScale) * 100);
                  const b2bHeightPct = Math.round((item.b2b / maxScale) * 100);
                  const isHovered = hoveredMonthIdx === idx;
                  return (
                    <div
                      key={item.month}
                      onMouseEnter={() => setHoveredMonthIdx(idx)}
                      onMouseLeave={() => setHoveredMonthIdx(null)}
                      className="flex flex-col items-center justify-end h-full gap-1 cursor-pointer"
                    >
                      <div className="w-full max-w-[28px] flex flex-col justify-end h-full">
                        <div
                          className={`w-full rounded-t-sm transition-opacity ${
                            isHovered ? 'bg-emerald-500' : 'bg-emerald-600'
                          }`}
                          style={{ height: `${b2bHeightPct}%` }}
                          title={`${item.month} B2B: $${item.b2b.toLocaleString()}`}
                        />
                        <div
                          className={`w-full transition-opacity ${
                            isHovered ? 'bg-blue-500' : 'bg-blue-600'
                          }`}
                          style={{ height: `${b2cHeightPct}%` }}
                          title={`${item.month} B2C: $${item.b2c.toLocaleString()}`}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">{item.month}</span>
                    </div>
                  );
                })}
              </div>

              {hoveredMonthIdx !== null && (
                <div className="p-3 bg-slate-900 text-white rounded-lg text-xs flex flex-wrap items-center justify-between gap-2 font-mono tabular-nums">
                  <span>{MONTHLY_REVENUE_SERIES[hoveredMonthIdx].month} 2026</span>
                  <span>B2C: ${MONTHLY_REVENUE_SERIES[hoveredMonthIdx].b2c.toLocaleString()}</span>
                  <span>B2B/School: ${MONTHLY_REVENUE_SERIES[hoveredMonthIdx].b2b.toLocaleString()}</span>
                  <span>
                    Total: $
                    {(
                      MONTHLY_REVENUE_SERIES[hoveredMonthIdx].b2c +
                      MONTHLY_REVENUE_SERIES[hoveredMonthIdx].b2b
                    ).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Revenue & Cost Simulator */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Interactive Unit Economics Simulator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Model monthly B2C accessory volume and B2B/School contracts against the $30,000 cost structure.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Monthly B2C Custom Units ($48 avg)</span>
                    <span className="font-mono tabular-nums font-semibold">{b2cMonthlyUnits} units/mo</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={1000}
                    step={25}
                    value={b2cMonthlyUnits}
                    onChange={(e) => setB2cMonthlyUnits(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Monthly B2B / School Contracts ($2.5k avg)</span>
                    <span className="font-mono tabular-nums font-semibold">{b2bContracts} contracts/mo</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={b2bContracts}
                    onChange={(e) => setB2bContracts(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Projected Annual B2C</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    ${simulatedAnnualB2C.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Projected Annual B2B / School</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    ${simulatedAnnualB2B.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Combined Annual Revenue</span>
                  <span className="font-mono tabular-nums font-bold text-blue-600">
                    ${simulatedTotalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-600">Est. Net Contribution (after $30k capex)</span>
                  <span className="font-mono tabular-nums font-bold text-emerald-700">
                    ${estimatedNetContribution.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Cost Structure ($30,000) & Channel Attribution */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Cost Structure Allocation ($30,000)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Supplier deposit, R&amp;D, Marketing, Logistics, and Operations breakdown.
                </p>
              </div>
              <div className="space-y-4">
                {COST_STRUCTURE_ITEMS.map((item) => (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.label}</span>
                      <span className="font-mono tabular-nums text-slate-900">
                        ${item.amount.toLocaleString()} ({item.sharePct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full"
                        style={{ width: `${item.sharePct}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Channel Attribution &amp; Customer Resources BI
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tracking Website, Social Media, Pop-Up Stores, and Corporate Brand Collabs.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                      <th className="py-2.5 pr-4">Channel</th>
                      <th className="py-2.5 px-3 text-right">Share</th>
                      <th className="py-2.5 px-3 text-right">Annual Rev</th>
                      <th className="py-2.5 px-3 text-right">CAC</th>
                      <th className="py-2.5 pl-3 text-right">Repeat %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {CHANNEL_PERFORMANCE.map((ch) => (
                      <tr key={ch.channel} className="hover:bg-slate-50">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-slate-900">{ch.channel}</div>
                          <div className="text-xs text-slate-500">Top: {ch.topSegment}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">{ch.sharePct}%</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          ${ch.annualRevenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">${ch.cac.toFixed(2)}</td>
                        <td className="py-3 pl-3 text-right font-mono tabular-nums text-emerald-700">
                          {ch.repeatRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Business Model Canvas Blueprint Inspection Modal */}
      {showBlueprintModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Original Business Model Canvas Blueprint"
        >
          <div className="bg-white rounded-xl max-w-5xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Source Business Model Canvas Blueprint
                </h3>
                <p className="text-xs text-slate-500">
                  All 9 canvas blocks mapped directly into Cadence Armor workflows.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBlueprintModal(false)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src="/assets/aistudio/Guessing_Game__1__4caa1846.png"
              alt="Business Model Canvas sticky-note diagram covering Key Partners, Activities, Propositions, Customer Relationships, Segments, Resources, Channels, Cost Structure, and Revenue Streams"
              className="w-full h-auto rounded-lg border border-slate-200"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
