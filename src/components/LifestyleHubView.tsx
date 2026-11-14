import React, { useMemo, useState } from 'react';
import { Check, Droplets, Heart, Mail, Send, Shield, Zap } from 'lucide-react';
import {
  CUSTOMER_SEGMENTS,
  PRODUCT_SPECS,
  SOCIAL_COMMUNITY_POSTS,
  WEEKLY_NEWSLETTER_EDITIONS,
} from '../data/businessData';
import {
  DailyHabitLog,
  NewsletterState,
  ProductCategory,
  SegmentId,
} from '../types/businessModel';

interface LifestyleHubViewProps {
  activeSegment: SegmentId;
  onSelectSegment: (segment: SegmentId) => void;
  habitLogs: DailyHabitLog[];
  onLogTodayHabit: (field: 'hydrationMet' | 'activeCarryMet' | 'socialShared') => void;
  newsletter: NewsletterState;
  onUpdateNewsletter: (next: NewsletterState) => void;
  onJumpToCategory: (category: ProductCategory) => void;
  onAddSegmentKit: (categories: ProductCategory[]) => void;
}

const NEWSLETTER_TOPICS = [
  'Hydration Pacing & Bottle Care',
  'New Designer Series Drops',
  'Campus & Commute Tech Protection',
  'KOL Run & Gym Routines',
];

export const LifestyleHubView: React.FC<LifestyleHubViewProps> = ({
  activeSegment,
  onSelectSegment,
  habitLogs,
  onLogTodayHabit,
  newsletter,
  onUpdateNewsletter,
  onJumpToCategory,
  onAddSegmentKit,
}) => {
  const segmentData = useMemo(
    () => CUSTOMER_SEGMENTS.find((s) => s.id === activeSegment) ?? CUSTOMER_SEGMENTS[0],
    [activeSegment]
  );

  const todayLog = habitLogs[habitLogs.length - 1];
  const [posts, setPosts] = useState(
    SOCIAL_COMMUNITY_POSTS.map((p) => ({ ...p, likedByMe: false }))
  );
  const [newPostText, setNewPostText] = useState('');
  const [emailInput, setEmailInput] = useState(newsletter.email);
  const [newsletterSavedMsg, setNewsletterSavedMsg] = useState('');

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = habitLogs.length - 1; i >= 0; i--) {
      if (habitLogs[i].hydrationMet || habitLogs[i].activeCarryMet) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  }, [habitLogs]);

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likedByMe ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPostText.trim();
    if (!trimmed) return;
    setPosts((prev) => [
      {
        id: `soc-${Date.now()}`,
        author: 'You',
        segment: segmentData.name,
        handle: '@my_cadence',
        streakDays: currentStreak,
        content: trimmed,
        likes: 1,
        gearTag: PRODUCT_SPECS[segmentData.recommendedCategories[0]].name,
        likedByMe: true,
      },
      ...prev,
    ]);
    setNewPostText('');
    if (!todayLog.socialShared) {
      onLogTodayHabit('socialShared');
    }
  };

  const handleToggleTopic = (topic: string) => {
    const exists = newsletter.topics.includes(topic);
    const updatedTopics = exists
      ? newsletter.topics.filter((t) => t !== topic)
      : [...newsletter.topics, topic];
    onUpdateNewsletter({ ...newsletter, topics: updatedTopics });
  };

  const handleSaveNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    onUpdateNewsletter({
      ...newsletter,
      subscribed: true,
      email: emailInput.trim(),
    });
    setNewsletterSavedMsg('Weekly newsletter preferences saved.');
    setTimeout(() => setNewsletterSavedMsg(''), 3500);
  };

  return (
    <div className="space-y-12">
      {/* Header & Segment Selection */}
      <section className="bg-white border border-[#E4E7DF] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500">
              Customer Segments · Healthy Lifestyle Supplies &amp; Engagement
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-900 mt-1 text-balance">
              Lifestyle Hub &amp; Daily Carry Routines
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
              Select your primary customer segment to personalize daily protection kits, healthy hydration check-ins, and weekly newsletter content.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums text-slate-600">
            Active Engagement Streak: <span className="font-semibold text-slate-900">{currentStreak} days</span>
          </div>
        </div>

        {/* 5 Customer Segments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CUSTOMER_SEGMENTS.map((seg) => {
            const active = seg.id === activeSegment;
            const stripGradient =
              seg.id === 'runners'
                ? 'from-[#F97316] to-[#EAB308]'
                : seg.id === 'gym'
                ? 'from-[#DB2777] to-[#F97316]'
                : seg.id === 'students'
                ? 'from-[#0EA5E9] to-[#2563EB]'
                : seg.id === 'office'
                ? 'from-[#10B981] to-[#0EA5E9]'
                : 'from-[#EAB308] to-[#10B981]';
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => onSelectSegment(seg.id)}
                className={`min-w-0 text-left rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                  active
                    ? 'bg-[#14221B] text-white border-[#14221B]'
                    : 'bg-[#FAFAF7] text-[#14221B] border-[#E4E7DF] hover:bg-white hover:border-[#10B981]'
                }`}
              >
                <div className={`h-2.5 w-full bg-gradient-to-r ${stripGradient}`} />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="font-display text-base font-bold">{seg.name}</div>
                    <div
                      className={`text-xs mt-1 leading-relaxed ${
                        active ? 'text-[#D3DDD6]' : 'text-[#4A5D52]'
                      }`}
                    >
                      {seg.tagline}
                    </div>
                  </div>
                  <div
                    className={`mt-3 text-xs font-mono tabular-nums ${
                      active ? 'text-[#A7F3D0]' : 'text-[#15803D]'
                    }`}
                  >
                    {seg.avgRetentionRate}% retention · {seg.repeatOrderRate}% repeat
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Segment Actionable Kit */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <h2 className="font-display text-xl font-semibold text-slate-900">
              {segmentData.name} Protection &amp; Wellness Blueprint
            </h2>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Daily Risk:</span> {segmentData.dailyChallenge}
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Healthy Target:</span> {segmentData.healthyGoal}
            </p>
            <p className="text-xs text-blue-700 font-medium pt-1">
              Retention insight: {segmentData.insightSummary}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {segmentData.recommendedCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onJumpToCategory(cat)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Customize {PRODUCT_SPECS[cat].shortName} (${PRODUCT_SPECS[cat].basePrice})
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onAddSegmentKit(segmentData.recommendedCategories)}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#15803D] rounded-xl hover:bg-[#166534] transition-colors whitespace-nowrap cursor-pointer w-fit"
            >
              Add 3-Item {segmentData.name} Kit to Bag
            </button>
          </div>
        </div>
      </section>

      {/* Customer Relationships: Daily Social Engagement & Weekly Newsletter */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Daily (through social media engagement) */}
        <div className="lg:col-span-7 bg-white border border-[#E4E7DF] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Daily Social Media Engagement &amp; Check-In
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Log today&apos;s healthy routine to update your Personal Analytics &amp; retention streak.
              </p>
            </div>
            <span className="font-mono tabular-nums text-xs font-semibold text-blue-600">
              Today&apos;s Score: {todayLog.score}/100
            </span>
          </div>

          {/* Interactive 3-part Daily Check-in */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onLogTodayHabit('hydrationMet')}
              className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                todayLog.hydrationMet
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <Droplets className="w-4 h-4 text-blue-600" />
                {todayLog.hydrationMet && <Check className="w-4 h-4 text-emerald-700" />}
              </div>
              <div className="mt-2 text-xs font-semibold">Hydration Goal</div>
              <div className="text-xs opacity-75 mt-0.5">
                {todayLog.hydrationMet ? 'Completed today' : 'Tap to log bottle'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => onLogTodayHabit('activeCarryMet')}
              className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                todayLog.activeCarryMet
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <Shield className="w-4 h-4 text-slate-700" />
                {todayLog.activeCarryMet && <Check className="w-4 h-4 text-emerald-700" />}
              </div>
              <div className="mt-2 text-xs font-semibold">Active Gear Carry</div>
              <div className="text-xs opacity-75 mt-0.5">
                {todayLog.activeCarryMet ? 'Protected session' : 'Tap to confirm'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => onLogTodayHabit('socialShared')}
              className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                todayLog.socialShared
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <Zap className="w-4 h-4 text-amber-600" />
                {todayLog.socialShared && <Check className="w-4 h-4 text-emerald-700" />}
              </div>
              <div className="mt-2 text-xs font-semibold">Daily Social Check-In</div>
              <div className="text-xs opacity-75 mt-0.5">
                {todayLog.socialShared ? 'Shared to community' : 'Tap to check in'}
              </div>
            </button>
          </div>

          {/* Share to Community Feed */}
          <form onSubmit={handleCreatePost} className="flex gap-2">
            <input
              type="text"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={`Share your ${segmentData.name.toLowerCase()} gear or hydration win today...`}
              className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Check-In</span>
            </button>
          </form>

          {/* Community Stream */}
          <div className="divide-y divide-slate-200">
            {posts.map((post) => (
              <div key={post.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <div>
                    <span className="font-semibold text-slate-900">{post.author}</span>
                    <span className="ml-1.5">{post.handle}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{post.segment}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="font-mono tabular-nums">{post.streakDays}d streak</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleLike(post.id)}
                    className={`inline-flex items-center gap-1 text-xs font-mono tabular-nums cursor-pointer ${
                      post.likedByMe ? 'text-rose-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.likedByMe ? 'fill-rose-600' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{post.content}</p>
                <div className="text-xs text-slate-500">{post.gearTag}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Weekly (through a newsletter) */}
        <div className="lg:col-span-5 bg-white border border-[#E4E7DF] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Mail className="w-3.5 h-3.5" />
              <span>Weekly Customer Relationship Channel</span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mt-1">
              Weekly Healthy Carry Newsletter
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Sent every Sunday morning with hydration benchmarks, material care guides, and Designer Series early access.
            </p>
          </div>

          <form onSubmit={handleSaveNewsletter} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="newsletter-email" className="text-xs font-semibold text-slate-700">
                Subscriber Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">Weekly Topic Tracks</div>
              <div className="space-y-2">
                {NEWSLETTER_TOPICS.map((topic) => {
                  const checked = newsletter.topics.includes(topic);
                  return (
                    <label
                      key={topic}
                      className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleTopic(topic)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      <span>{topic}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {newsletter.subscribed ? 'Update Weekly Digest Preferences' : 'Subscribe to Weekly Newsletter'}
            </button>

            {newsletterSavedMsg && (
              <p className="text-xs font-medium text-emerald-700">{newsletterSavedMsg}</p>
            )}
          </form>

          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="text-xs font-semibold text-slate-700">Recent Weekly Editions</div>
            {WEEKLY_NEWSLETTER_EDITIONS.map((issue) => (
              <div key={issue.week} className="space-y-1">
                <div className="text-xs text-slate-500">{issue.week}</div>
                <div className="text-sm font-semibold text-slate-900">{issue.headline}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{issue.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
