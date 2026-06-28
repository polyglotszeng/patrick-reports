# Starlink 全球覆盖分析

5-tab merged dashboard showing the complete Starlink constellation analysis
from 2026-06-28 CelesTrak TLE snapshot.

## Files
- `index.html` — 5-tab merged dashboard (recommended entry)
- `live.html` — 10,652-satellite live position map (clickable)
- `coverage.html` — 2,592-cell density heatmap
- `compare.html` — 5-constellation comparison (Starlink / Kuiper / OneWeb / Qianfan / GUOWANG)
- `service-value.html` — GDP × Population × Coverage (World Bank 2023)
- `animation.html` — 12-hour evolution with NASA Blue Marble Earth (clickable, draggable)

## Data sources
- Satellite positions: CelesTrak OMM (epoch 2026-06-25, SGP4 propagated to 2026-06-28)
- Country borders: Natural Earth 110m admin-0
- Earth texture: NASA Blue Marble 1024×512 JPG (CC0)
- GDP: World Bank NY.GDP.MKTP.CD 2023
- Population: World Bank SP.POP.TOTL 2023

## Generation date
2026-06-28T06:47:25Z
