-- Patrick's feedback DB (07-12 NEW)
-- Captures: page-level rating, route state, optional text, lang
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  score TEXT NOT NULL,             -- 'off' | 'okay' | 'great'
  text TEXT,                        -- optional longer text
  lang TEXT DEFAULT 'zh',            -- 'zh' | 'en'
  path TEXT,                        -- URL path (e.g., /daily-reports)
  page TEXT,                        -- page identifier (e.g., 'daily-reports')
  route_state TEXT,                 -- JSON: dial/mood/track/route snapshot
  ip_country TEXT,                   -- optional, from CF request.cf.country
  user_agent TEXT,                  -- optional, browser identification
  ts INTEGER NOT NULL                -- unix timestamp ms
);
CREATE INDEX IF NOT EXISTS idx_feedback_ts ON feedback(ts DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_page_ts ON feedback(page, ts DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_score ON feedback(score);
