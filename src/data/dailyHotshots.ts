/**
 * Daily Hotshots - one headline event selected per game day.
 * Each event carries an impact map keyed by the in-game asset symbols.
 */

export type HotshotImpact = Record<string, number>;

export type DailyHotshotEvent = {
  id: string;
  title: string;
  description: string;
  explanation: string;
  impact: HotshotImpact;
  difficulty: 'low' | 'mid' | 'high';
};

export const DAILY_HOTSHOTS: DailyHotshotEvent[] = [
  {
    id: 'low-1',
    title: 'New Tourist Destinations',
    description:
      'A major tourism agency (ETST) adds new, highly popular, and exclusive holiday packages to its portfolio.',
    explanation:
      'Offering unique and desirable vacation spots makes the tourism agency more attractive than competitors, increasing bookings and revenue.',
    impact: {
      KOC: 0.02,
      THYAO: 0.05,
      AAPL: 0.02,
      MSFT: 0.02,
      KO: 0.02,
      DIS: 0.03,
      PGSUS: 0.07,
      TREN: 0.02,
      INSA: 0.02,
      INSD: 0.02,
      ETST: 0.1,
      MEDIA: 0.02,
      ODL: 0.02,
      KCS: 0.01,
    },
    difficulty: 'low',
  },
  {
    id: 'low-2',
    title: 'E-commerce Delivery Speed',
    description:
      'The e-commerce giant (TREN) announces that it will now deliver packages in major cities within 3 hours, free of charge.',
    explanation:
      "Faster delivery is a massive competitive advantage. It encourages customers to switch from slower rivals, increasing TREN's market share and value.",
    impact: {
      KOC: 0.03,
      THYAO: 0.01,
      AAPL: 0.04,
      MSFT: 0.04,
      KO: 0.02,
      DIS: 0.02,
      PGSUS: 0.01,
      TREN: 0.1,
      INSA: 0.01,
      INSD: 0.03,
      ETST: 0.02,
      MEDIA: 0.05,
      ODL: 0.06,
      KCS: 0.02,
    },
    difficulty: 'low',
  },
  {
    id: 'low-3',
    title: 'Infrastructure Project Delay',
    description:
      'A critical segment of a major infrastructure project managed by INSA (Construction) is delayed for six months due to unforeseen geological issues.',
    explanation:
      "Project delays lead to cost overruns and potential penalty fees, reducing the construction company's expected profit and causing the stock to drop.",
    impact: {
      KOC: -0.03,
      THYAO: -0.03,
      AAPL: -0.01,
      MSFT: -0.01,
      KO: -0.02,
      DIS: -0.02,
      PGSUS: -0.04,
      TREN: -0.02,
      INSA: -0.1,
      INSD: -0.02,
      ETST: -0.05,
      MEDIA: -0.02,
      ODL: -0.01,
      KCS: 0.01,
    },
    difficulty: 'low',
  },
  {
    id: 'low-4',
    title: 'Electronics Store Closure',
    description:
      'One of the largest electronics retail chains (MEDIA) is forced to close many of its physical stores due to high rent costs.',
    explanation:
      'Closing profitable stores reduces the overall sales capacity and signals financial difficulties, which is negatively viewed by the market.',
    impact: {
      KOC: -0.02,
      THYAO: 0.0,
      AAPL: 0.05,
      MSFT: 0.05,
      KO: -0.01,
      DIS: 0.0,
      PGSUS: 0.01,
      TREN: 0.08,
      INSA: 0.0,
      INSD: 0.03,
      ETST: 0.0,
      MEDIA: -0.1,
      ODL: 0.03,
      KCS: 0.02,
    },
    difficulty: 'low',
  },
  {
    id: 'mid-1',
    title: 'Jet Fuel Price Spike',
    description:
      'Global jet fuel prices surge to a record high, significantly increasing operating costs for airlines.',
    explanation:
      'Airlines like PGSUS have huge fuel expenses. When fuel costs rise dramatically, their profit margins shrink, and the stock price falls.',
    impact: {
      KOC: -0.03,
      THYAO: -0.08,
      AAPL: -0.02,
      MSFT: -0.02,
      KO: -0.02,
      DIS: -0.03,
      PGSUS: -0.1,
      TREN: -0.02,
      INSA: -0.03,
      INSD: -0.02,
      ETST: -0.06,
      MEDIA: -0.02,
      ODL: -0.01,
      KCS: -0.005,
    },
    difficulty: 'mid',
  },
  {
    id: 'mid-2',
    title: 'SaaS Platform Wins Global Contract',
    description:
      'The marketing software giant (INSD) lands a major contract with a Fortune 500 company in the USA, expanding its international footprint.',
    explanation:
      'Securing large international clients validates the technology and promises long-term, high-margin subscription revenue, driving the tech stock higher.',
    impact: {
      KOC: 0.03,
      THYAO: 0.01,
      AAPL: 0.07,
      MSFT: 0.07,
      KO: 0.02,
      DIS: 0.02,
      PGSUS: 0.01,
      TREN: 0.03,
      INSA: 0.05,
      INSD: 0.1,
      ETST: 0.02,
      MEDIA: 0.02,
      ODL: 0.03,
      KCS: 0.06,
    },
    difficulty: 'mid',
  },
  {
    id: 'mid-3',
    title: 'Fintech Fee Regulation',
    description:
      'The government announces a new regulation that caps the transaction fees that digital payment processors (ODL) can charge merchants.',
    explanation:
      'Lower fees mean less revenue for Fintech companies for every transaction processed, directly limiting their profit potential and causing the stock price to drop.',
    impact: {
      KOC: -0.03,
      THYAO: -0.02,
      AAPL: -0.04,
      MSFT: -0.04,
      KO: 0.0,
      DIS: -0.01,
      PGSUS: -0.02,
      TREN: 0.08,
      INSA: -0.01,
      INSD: -0.05,
      ETST: -0.02,
      MEDIA: -0.02,
      ODL: -0.1,
      KCS: 0.04,
    },
    difficulty: 'mid',
  },
  {
    id: 'mid-4',
    title: 'E-commerce Seller Fees Cut',
    description:
      'TREN cuts the commission fees it charges third-party sellers on its platform by 5% to attract more merchants.',
    explanation:
      'While margins initially drop, attracting more sellers leads to a wider product range and increased customer traffic, ultimately boosting transaction volume and long-term dominance.',
    impact: {
      KOC: 0.03,
      THYAO: 0.01,
      AAPL: 0.05,
      MSFT: 0.05,
      KO: 0.02,
      DIS: 0.02,
      PGSUS: 0.01,
      TREN: 0.1,
      INSA: 0.0,
      INSD: 0.04,
      ETST: 0.02,
      MEDIA: -0.06,
      ODL: 0.03,
      KCS: 0.02,
    },
    difficulty: 'mid',
  },
  {
    id: 'high-1',
    title: 'Unforeseen FX (Foreign Exchange) Strength',
    description:
      'The Turkish Lira (TL) strengthens significantly and unexpectedly against the Euro and Dollar.',
    explanation:
      'A strong TL benefits companies with large foreign currency debt (like some airlines - PGSUS) but can hurt the local competitiveness of import-reliant retailers (MEDIA).',
    impact: {
      KOC: 0.05,
      THYAO: 0.07,
      AAPL: -0.04,
      MSFT: -0.04,
      KO: -0.02,
      DIS: -0.02,
      PGSUS: 0.1,
      TREN: 0.03,
      INSA: 0.02,
      INSD: -0.05,
      ETST: 0.06,
      MEDIA: 0.08,
      ODL: -0.03,
      KCS: 0.03,
    },
    difficulty: 'high',
  },
  {
    id: 'high-2',
    title: 'Major Corporate Data Breach',
    description:
      'A prominent Turkish bank suffers a massive data breach, highlighting the crucial need for advanced corporate cybersecurity solutions.',
    explanation:
      'Fear of hacks and non-compliance drives up immediate demand for leading corporate cybersecurity providers (KCS), signaling massive new contract opportunities.',
    impact: {
      KOC: 0.03,
      THYAO: 0.02,
      AAPL: 0.05,
      MSFT: 0.05,
      KO: 0.02,
      DIS: 0.04,
      PGSUS: 0.02,
      TREN: 0.03,
      INSA: 0.02,
      INSD: 0.08,
      ETST: 0.02,
      MEDIA: 0.03,
      ODL: 0.07,
      KCS: 0.1,
    },
    difficulty: 'high',
  },
  {
    id: 'high-3',
    title: 'Infrastructure Privatization Announcement',
    description:
      "The government announces a tender for the privatization of a major highway project, generating massive competition among construction groups.",
    explanation:
      "News of huge government contracts (even if it's just a tender) signals future high-margin work for companies like INSA, boosting the sector outlook.",
    impact: {
      KOC: 0.06,
      THYAO: 0.03,
      AAPL: 0.03,
      MSFT: 0.03,
      KO: 0.02,
      DIS: 0.03,
      PGSUS: 0.03,
      TREN: 0.04,
      INSA: 0.1,
      INSD: 0.03,
      ETST: 0.06,
      MEDIA: 0.03,
      ODL: 0.02,
      KCS: 0.03,
    },
    difficulty: 'high',
  },
  {
    id: 'high-4',
    title: 'New Regulation Mandates Local Payment System',
    description:
      'The government mandates that all domestic e-commerce transactions must use a locally certified payment infrastructure (ODL) to reduce reliance on foreign processors.',
    explanation:
      'This creates sudden, mandatory demand for local Fintech solutions, directly benefiting firms like ODL, while increasing operational costs for platforms like TREN that rely on multiple systems.',
    impact: {
      KOC: 0.04,
      THYAO: 0.02,
      AAPL: 0.04,
      MSFT: 0.04,
      KO: 0.03,
      DIS: 0.03,
      PGSUS: 0.02,
      TREN: 0.08,
      INSA: 0.02,
      INSD: 0.05,
      ETST: 0.03,
      MEDIA: 0.04,
      ODL: 0.1,
      KCS: 0.07,
    },
    difficulty: 'high',
  },
  
  
];

export function pickTodayHotshot(_date: Date): DailyHotshotEvent {
  const index = Math.floor(Math.random() * DAILY_HOTSHOTS.length);
  return DAILY_HOTSHOTS[index];
}
