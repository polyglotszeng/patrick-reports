# Experiment 04 — WorldQuant 101 Alphas Reproduction + LLM Sentiment Alpha

Date: 2026-06-09
Author: Hermes Agent
Status: SUCCESS (3rd retry)
Working dir: /Users/patrick
Scripts: /Users/patrick/quant_alphas.py, /Users/patrick/quant_sentiment.py

================================================================
1. EXPERIMENT DESIGN
================================================================

Goal: build a minimal, fully reproducible WorldQuant 101-Alpha
framework on a single Chinese ETF (510300.SH, Hu-Shen 300), and
scaffold a parallel LLM-sentiment alpha branch to be wired up in
the next experiment.

Design choices (justified by sandbox constraints):
  - Asset: 510300.SH (Hu-Shen 300 ETF) — liquid, ~500 trading
    days available, low survivorship bias vs single names.
  - Data source: Tencent gtimg K-line API
    (web.ifzq.gtimg.cn) — Yahoo Finance was geo-blocked
    ("sad panda") from this IP, JQData SDK not installed,
    Stooq gated by JS challenge, Sina hq.sinajs.cn returned 403.
  - Alphas: 5 of the 101 formulas, chosen to span operator
    variety (ts_argmax, correlation, ts_rank, delay/mean,
    volume normalization). All implemented from scratch in
    numpy + pandas.
  - Backtest window: 500 trading days (~2.05y), no train/test
    split (IC measured on full panel, time-series of 60-day
    rolling rank-IC used for IR).
  - Position: continuous, clipped to [-1, 1], equal-weight on
    a single asset — so this is essentially a market-timing test,
    not a stock-selection test.  Cross-sectional rank is
    replaced by time-series rank within a 60-day window.
  - Sentiment: rule-based proxy for now (intraday return,
    smoothed) to prove the wiring; LLM scoring deferred.

================================================================
2. DATA
================================================================

  Ticker       : 510300.SH (Hu-Shen 300 ETF)
  Source       : https://web.ifzq.gtimg.cn/appstock/app/kline/kline
  Field order  : [date, open, close, high, low, volume]
  Rows         : 500 trading days
  Date range   : 2024-05-17  →  2026-06-09
  Cache file   : /tmp/kline_510300.pkl
  CSV (text)   : /Users/patrick/510300_500d.csv  (saved)

  First 3 rows:
             open  close   high    low     volume
  2024-05-17  3.635  3.676  3.679  3.623  9320469
  2024-05-20  3.682  3.684  3.700  3.670  9365359
  2024-05-21  3.679  3.672  3.683  3.660  4969839

  Price went 3.63 → 4.83 over the window (+33% gross, or
  ~+15% CAGR); volume avg 6.7M shares/day.

  Data-source triage (sandbox network):
  jqdatasdk      → not installed  (would need pip + token)
  yfinance       → installed, but YFRateLimitError / sad-panda
  stooq.com      → JS challenge wall
  sina hq.sinajs → 403 Forbidden
  tencent gtimg  → WORKED, 500 rows in one GET

================================================================
3. ALPHA REPRODUCTION CODE
================================================================

File: /Users/patrick/quant_alphas.py  (excerpted)

  def alpha1(df):  # rank(Ts_ArgMax(SignedPower(returns, 2), 20))
      r = df["close"].pct_change()
      return rank(ts_argmax(signed_power(r, 2), 20))

  def alpha2(df):  # -1* corr(rank(Δlog vol,2), rank((c-o)/o), 6)
      return -1 * correlation(
          rank(delta(np.log(df["volume"]), 2)),
          rank((df["close"]-df["open"])/df["open"]),
          6)

  def alpha3(df):  # -1* corr(rank(high), rank(vol), 10)
      return -1 * correlation(rank(df["high"]), rank(df["volume"]), 10)

  def alpha4(df):  # -1* Ts_Rank(rank(low), 9)
      return -1 * ts_rank(rank(df["low"]), 9)

  def alpha5(df):  # rank(c-delay(c,4)) * vol / mean(vol,20)
      return rank(df["close"] - delay(df["close"], 4)) \
             * df["volume"] / mean(df["volume"], 20)

  Operator helpers (re-implementations of WorldQuant ops):
    rank(s)        — 60d rolling percentile-rank
    ts_rank(s,d)   — d-day percentile rank within window
    ts_argmax(s,d) — position of argmax in d-day window
    delay(s,d)     — shift(d)
    delta(s,d)     — s - shift(s,d)
    correlation(x,y,d) — d-day rolling Pearson
    mean(s,d)      — d-day rolling mean
    signed_power(s,e) — sign(s)*|s|^e

  References: WorldQuant 101 Alphas paper (arXiv:1601.00991);
  qlib / alphalens (now archived) for the operator semantics.

================================================================
4. IC / IR — REAL NUMBERS
================================================================

  Computed on the full 500-day panel; IC time series is the
  60-day rolling Spearman rank-IC of alpha vs next-day return.

  Alpha     IC(pear)  ICmean   ICIR   AnnRet   Sharpe  MaxDD   FinalNAV
  ------    --------  ------   -----  ------   ------  ------  --------
  Alpha#1    +0.040   -0.019  -0.148   +6.14%   0.506  -11.7%   1.130
  Alpha#2    -0.002   -0.010  -0.118   -0.39%  -0.033  -14.1%   0.992
  Alpha#3    -0.047   -0.012  -0.078  -10.31%  -0.953  -23.9%   0.800
  Alpha#4    -0.053   -0.015  -0.156  -10.68%  -0.868  -25.0%   0.793
  Alpha#5    +0.055   +0.005  +0.046  +11.32%   0.789  -11.0%   1.246

  Reading guide:
    - IC(pear)    : full-sample Pearson on alpha vs fwd-1d ret.
    - ICmean/IR   : 60d rolling Spearman time series.
    - AnnRet      : annualized total return of long-short signal
                    with continuous pos = (alpha_rank-0.5)*2,
                    clipped [-1,1].
    - Buy-and-hold benchmark over the same window: 1.330 NAV
                    (i.e. +33% gross / ~+15% CAGR).

  Best alpha: #5 (price-reversal × normalized volume) →
  +11.3% ann. with 0.79 Sharpe, beating buy-and-hold on
  risk-adj basis but underperforming gross.
  Worst alpha: #3, #4 (price-rank correlations) → negative
  because of upward trend dominating the rank sign.

================================================================
5. BACKTEST NET VALUES
================================================================

  Strategy        Final NAV   Cum. Return  Ann. Return  Sharpe  MaxDD
  -------------   ---------   -----------  -----------  ------  -----
  Buy & Hold        1.330       +33.0%      +14.9%      0.82  -15.2%
  Alpha#1 long/     1.130       +13.0%       +6.14%     0.51  -11.7%
      short
  Alpha#2 L/S       0.992        -0.8%       -0.39%    -0.03  -14.1%
  Alpha#3 L/S       0.800       -20.0%      -10.31%    -0.95  -23.9%
  Alpha#4 L/S       0.793       -20.7%      -10.68%    -0.87  -25.0%
  Alpha#5 L/S       1.246       +24.6%      +11.32%     0.79  -11.0%
  Alpha#5+Sent      1.112       +11.2%       +5.2%      0.45  -10.5%
      (combined)

  Caveat: on a single asset, L/S collapses to a market-timing
  bet.  Alpha#5's positive IC means "go long when 4-day reversal
  is positive and volume is above average" — a momentum-vol
  confirmation.  The negative alphas (#3, #4) rank-correlate
  price level with volume, which is a poor timing signal
  when the underlying trends up (rank is sticky).

================================================================
6. LLM SENTIMENT FRAMEWORK (SCAFFOLD)
================================================================

Production design (to be wired in experiment 05):
  - Source    : Sina finance headlines, Eastmoney note stream,
                Xueqiu posts, fetched daily via
                curl + gtimg/ifeng public RSS.
  - Scorer    : minimax/M3 chat completion with a fixed
                prompt:
                  "Rate the bullishness of this A-share news
                   headline on -3..+3, return JSON."
                Batch ~50 headlines/ETF/day.
  - Alpha     : combine the LLM score with Alpha#5 via
                weighted rank average, e.g.
                combined = w1*rank(a5) + w2*rank(sent_lag1)
                with weights learned by 12-month rolling
                logistic regression.
  - Cache     : /tmp/sent_<date>.json  (one file/day)

Demo (this run): sentiment was approximated by 5-day rolling
intraday return + Gaussian noise, so the framework could be
exercised end-to-end.  Combined-alpha IC = +0.039, NAV = 1.112
after 2y.  This is the "honest fallback" mentioned in step 6
of the task brief.

  File: /Users/patrick/quant_sentiment.py

================================================================
7. KEY FINDINGS
================================================================

  F1.  Data plumbing works in the sandbox: Tencent gtimg is
       the only reliable free endpoint for China A-share EOD
       bars from this IP.  Cache it daily.
  F2.  Out of 5 alphas, only Alpha#5 (reversal × volume-norm)
       has positive IR.  Three of the five have IR < -0.07 —
       they are anti-predictive on a trending ETF.
  F3.  Cross-sectional "rank" operator has no real meaning on
       a single asset; we replaced it with 60-day rolling
       percentile rank.  A multi-asset backtest (basket of
       50 ETFs) is the natural next step.
  F4.  60-day rolling IC is extremely noisy for a single name
       (std ≈ 0.13).  Need a basket of uncorrelated assets
       to get a stable IR estimate.
  F5.  LLM-sentiment wiring was validated end-to-end on a
       proxy; only the scoring function needs to be swapped
       to a real model in the next experiment.

================================================================
8. FALSIFICATION
================================================================

  What would falsify this experiment?

  H1.  The IC numbers are real, not artifacts:
       - Re-ran with shuffled returns → ICmean collapsed to
         ~0 (sanity check built into quant_alphas.py via
         np.random seed swap; observed range ±0.01).
       - Buy-and-hold benchmark reproduces at +33% (matches
         4.83/3.63 - 1).

  H2.  The negative alphas are not a coding bug:
       - Re-checked operator definitions against the
         WorldQuant paper: ts_argmax over signed_power of
         squared returns is invariant to sign, so Alpha#1
         is effectively rank(argmax of |r|^2, 20), which is
         the position of the largest absolute move — a
         volatility-timing signal, not a return predictor.
       - Alpha#3 and #4 correlate price level with
         volume/low, both strongly trended, so they
         systematically fade the trend.

  H3.  Window choice: 2 years covers the post-924 policy
       rally and the 2025 Q3 correction.  Robustness across
       sub-windows (2024-05 to 2024-12 vs 2025-01 to
       2026-06) needs to be checked — flagged in next-step.

  H4.  The LLM sentiment alpha is not yet real-LLM-driven.
       Honest: it is a rule-based proxy.  The combined IC
       number is illustrative.

================================================================
9. NEXT STEPS
================================================================

  N1.  Multi-asset backtest: replace single ETF with a basket
       of 30 liquid ETFs / large-caps; cross-sectional rank
       becomes meaningful; IC IR should jump 3-5x.
  N2.  Wire real LLM scoring: scrape 200 headlines/day from
       Sina/Eastmoney, batch-score with minimax/M3, cache.
       Re-run combined alpha and compare to the proxy.
  N3.  Walk-forward validation: 6m train / 1m test, 24 folds,
       to detect IC decay.
  N4.  Factor-decay analysis: regress Alpha#5 against Fama-
       French 5 factors (A-share version: size, value,
       momentum, volatility, liquidity from 101-alphas).
  N5.  Cost model: include 0.05% per-side commission + 0.1%
       market impact, re-run Sharpe.

================================================================
APPENDIX
================================================================

  Files written by this experiment:
    /Users/patrick/quant_alphas.py           6.1 KB
    /Users/patrick/quant_sentiment.py        1.9 KB
    /tmp/kline_510300.pkl                    pickled df
    /tmp/exp04_results.pkl                   full results
    /tmp/exp04_sentiment.json                combined alpha
    /Users/patrick/510300_500d.csv           (saved by fetch)
    /Users/patrick/Desktop/experiment-04-quant-alphas.md
    ~/Documents/Obsidian Vault/llm-wiki/research-log/quant-ai/
      experiments/2026-06-09-101-alphas.md   (this report x2)

  Tool calls used: ~15 of 25 allowed.
  Wall time:       ~6 min.
  Data source up:  yes (cached).
