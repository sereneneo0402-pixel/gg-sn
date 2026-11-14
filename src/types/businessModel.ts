export type NavTab = 'studio' | 'lifestyle' | 'analytics' | 'partners' | 'warranty';

export type SegmentId = 'students' | 'office' | 'gym' | 'runners' | 'children';

export type ProductCategory = 'phone' | 'earbuds' | 'laptop' | 'bottle';

export type DesignMode = 'custom' | 'designer';

export type MaterialId = 'impact-polymer' | 'matte-silicone' | 'recycled-knit' | 'anodized-guard';

export type PatternId = 'solid' | 'topographic' | 'pace-stripe' | 'kinetic-grid';

export interface CustomerSegment {
  id: SegmentId;
  name: string;
  tagline: string;
  dailyChallenge: string;
  healthyGoal: string;
  recommendedCategories: ProductCategory[];
  preferredDesignerId: string;
  avgRetentionRate: number;
  repeatOrderRate: number;
  avgMonthlyHydrationLogs: number;
  insightSummary: string;
}

export interface ProductSpec {
  id: ProductCategory;
  name: string;
  shortName: string;
  basePrice: number;
  dropRating: string;
  weight: string;
  partnerNote: string;
  warrantyTerm: string;
  summary: string;
}

export interface MaterialOption {
  id: MaterialId;
  name: string;
  priceDelta: number;
  finishDescription: string;
  supplierName: string;
  durabilityScore: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  contrastText: string;
}

export interface PatternOption {
  id: PatternId;
  name: string;
  priceDelta: number;
  description: string;
}

export interface DesignerEdition {
  id: string;
  name: string;
  kolName: string;
  kolRole: string;
  segmentFit: SegmentId;
  category: ProductCategory;
  primaryColor: string;
  accentColor: string;
  material: MaterialId;
  pattern: PatternId;
  priceDelta: number;
  editionRun: string;
  story: string;
}

export interface CustomConfig {
  category: ProductCategory;
  mode: DesignMode;
  material: MaterialId;
  primaryColor: string;
  accentColor: string;
  pattern: PatternId;
  engraving: string;
  designerEditionId: string | null;
}

export interface CartItem {
  id: string;
  category: ProductCategory;
  title: string;
  mode: DesignMode;
  materialName: string;
  primaryColor: string;
  accentColor: string;
  pattern: PatternId;
  engraving: string;
  designerName?: string;
  unitPrice: number;
  quantity: number;
}

export interface RegisteredGear {
  id: string;
  serialCode: string;
  category: ProductCategory;
  productTitle: string;
  purchaseDate: string;
  warrantyDaysRemaining: number;
  status: 'Active Coverage' | 'Claim Under Review' | 'Replacement Shipped';
  colorHex: string;
  lastCheckInDate: string;
}

export interface WarrantyClaim {
  id: string;
  gearId: string;
  serialCode: string;
  productTitle: string;
  defectType: string;
  description: string;
  submittedAt: string;
  status: 'Submitted' | 'Approved' | 'Replacement Shipped';
}

export interface DailyHabitLog {
  date: string;
  label: string;
  hydrationMet: boolean;
  activeCarryMet: boolean;
  socialShared: boolean;
  score: number;
}

export interface NewsletterState {
  subscribed: boolean;
  email: string;
  topics: string[];
  cadence: 'Weekly Digest';
}

export interface ChannelEvent {
  id: string;
  title: string;
  channelType: 'Pop-up Store' | 'Corporate Collab' | 'Run Club';
  date: string;
  location: string;
  partner: string;
  spotsRemaining: number;
  description: string;
}

export interface SupplierRecord {
  id: string;
  name: string;
  category: string;
  partnerType: 'Bottle Manufacturer' | 'Material Supplier' | 'KOL / Influencer' | 'HR & Design Lab';
  leadTimeDays: number;
  defectRate: string;
  sustainabilityNote: string;
}

export interface MarketPollOption {
  id: string;
  label: string;
  category: string;
  votes: number;
}

export interface B2BQuoteRecord {
  id: string;
  organization: string;
  orgType: 'School / University' | 'Corporate Wellness' | 'Gym Chain' | 'Running Club';
  quantity: number;
  categories: ProductCategory[];
  crestText: string;
  estimatedTotal: number;
  submittedAt: string;
}
