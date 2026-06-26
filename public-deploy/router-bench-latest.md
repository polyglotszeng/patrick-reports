# Router Benchmark — Decision Table

生成时间: 2026-06-14T07:47:36.540178

任务数: 4 × provider 数: 4


## 综合分 (0-100, 高=好)

| Task \ Provider | minimax | ollama_hermes3 | ollama_qwen3 | ollama_gemma4 | ollama_qwen35_TRAP | Winner |
|---|---|---|---|---|---|---|
| simple_typo | 100 (2.18s) | 100 (3.6s) | 100 (9.65s) | 100 (10.18s) | ❌ | **minimax** |
| test_generation | ❌ | 100 (8.34s) | 0 (36.32s) | 100 (26.0s) | ❌ | **ollama_hermes3** |
| self_review | 70 (9.0s) | 100 (15.26s) | 100 (20.56s) | 100 (19.22s) | ❌ | **ollama_hermes3** |
| multi_file_refactor | 77 (5.42s) | 100 (5.76s) | 0 (96.13s) | 77 (18.98s) | ❌ | **ollama_hermes3** |

## 延迟 (秒, 低=好)

| Task \ Provider | minimax | ollama_hermes3 | ollama_qwen3 | ollama_gemma4 | ollama_qwen35_TRAP | Fastest |
|---|---|---|---|---|---|---|
| simple_typo | 2.18s | 3.6s | 9.65s | 10.18s | ❌ | **minimax** |
| test_generation | ❌ | 8.34s | 36.32s | 26.0s | ❌ | **ollama_hermes3** |
| self_review | 9.0s | 15.26s | 20.56s | 19.22s | ❌ | **minimax** |
| multi_file_refactor | 5.42s | 5.76s | 96.13s | 18.98s | ❌ | **minimax** |

## 决策建议

- **simple_typo**:
  - 首选: `minimax` (100 分, 2.18s)
  - 备选: `ollama_hermes3` (100 分, 3.6s)
  - 理由: 短文本 + 单一改动, 端侧 qwen3/hermes3 速度快够用, 云端浪费
- **test_generation**:
  - 首选: `ollama_hermes3` (100 分, 8.34s)
  - 备选: `ollama_gemma4` (100 分, 26.0s)
  - 理由: 需要语法正确 + XCTest API 知识, hermes3 验证 codegen 之王
- **self_review**:
  - 首选: `ollama_hermes3` (100 分, 15.26s)
  - 备选: `ollama_qwen3` (100 分, 20.56s)
  - 理由: 评分要确定性, temperature=0 + JSON 强制的端侧最稳
- **multi_file_refactor**:
  - 首选: `ollama_hermes3` (100 分, 5.76s)
  - 备选: `minimax` (77 分, 5.42s)
  - 理由: 长上下文 + 多文件理解, 云端大模型优势明显, 端侧易丢上下文