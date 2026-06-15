// TypeScript 类型定义

export interface Lab {
  rank: number;
  list_section: 'main' | 'watchlist';
  name: string;
  slug: string;
  valuation_billion_usd: number | null;
  total_funding_billion_usd: number | null;
  founded_year: number;
  category: string;
  hq: string;
  founders: string;
  founder_openai_deepmind_alumni_count: number;
  theory_basis: string;
  achievements: string;
  investment_highlights: string;
  investor_signal: string[];
  status_emoji: '✅' | '🔬' | '🤝';
  open_source: boolean;
  estimated_valuation_to_revenue_ratio: number | null;
  estimated_runway_months: number | null;
  valuation_to_funding_leverage: number;
  last_round_growth_multiple: number | null;
  commercialization_stage_score: number;
  team_stability_score: number;
  last_round: {
    type: string;
    amount_billion_usd: number;
    date: string;
    valuation_billion_usd: number;
  };
  next_expected_round: {
    type: string;
    estimated_window_months: string;
    expected_window: string;
  };
  risk_signals: string[];
  data_freshness: string;
  data_freshness_days: number;
  watchlist_reason?: string;
}

export interface PortfolioItem {
  slug: string;
  cost_usd_million: number;
  ownership_pct: number;
  invested_date: string;
}
