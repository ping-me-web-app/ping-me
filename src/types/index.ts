export type ChannelType = 'whatsapp' | 'sms' | 'email';

export type PresetKey = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';

export interface AlertPreset {
  key: PresetKey;
  id: `presets.${PresetKey}`;
}

export type PostNLStep = 'received' | 'printed' | 'transit' | 'delivered';

export interface VehicleInfo {
  plate: string;
  brand: string;
  model: string;
  color?: string;
}

export interface StickerToken {
  code: string;
  status: 'active' | 'unclaimed';
  vehicle?: VehicleInfo;
  channel?: ChannelType;
  maskedRecipient?: string;
}

export interface SubscriptionInfo {
  planName: string;
  price: number;
  currency: string;
  interval: 'year';
  status: 'active' | 'past_due' | 'canceled';
  nextBillingDate: string;
  currentPeriodEnd: string;
}

export interface PostNLTracking {
  barcode: string;
  currentStep: PostNLStep;
  estimatedDelivery: string;
  statusText: string;
}
