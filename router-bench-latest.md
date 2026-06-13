# Router Benchmark — Decision Table

生成时间: 2026-06-12T15:30:07.822725

任务数: 4 × provider 数: 4


## 综合分 (0-100, 高=好)

| Task \ Provider | minimax | ollama_hermes3 | ollama_qwen3 | ollama_gemma4 | ollama_qwen35_TRAP | Winner |
|---|---|---|---|---|---|---|
| simple_typo | ❌ | 100 (2.44s) | 100 (7.22s) | 100 (9.27s) | ❌ | **ollama_hermes3** |
| test_generation | ❌ | 100 (8.95s) | 0 (32.68s) | 100 (26.61s) | ❌ | **ollama_hermes3** |
| self_review | ❌ | 100 (4.13s) | 100 (22.09s) | 100 (21.31s) | ❌ | **ollama_hermes3** |
| multi_file_refactor | ❌ | 100 (6.86s) | 0 (65.04s) | 77 (22.08s) | ❌ | **ollama_hermes3** |

## 延迟 (秒, 低=好)

| Task \ Provider | minimax | ollama_hermes3 | ollama_qwen3 | ollama_gemma4 | ollama_qwen35_TRAP | Fastest |
|---|---|---|---|---|---|---|
| simple_typo | ❌ | 2.44s | 7.22s | 9.27s | ❌ | **ollama_hermes3** |
| test_generation | ❌ | 8.95s | 32.68s | 26.61s | ❌ | **ollama_hermes3** |
| self_review | ❌ | 4.13s | 22.09s | 21.31s | ❌ | **ollama_hermes3** |
| multi_file_refactor | ❌ | 6.86s | 65.04s | 22.08s | ❌ | **ollama_hermes3** |

## 决策建议

- **simple_typo**:
  - 首选: `ollama_hermes3` (100 分, 2.44s)
  - 备选: `ollama_qwen3` (100 分, 7.22s)
  - 理由: 短文本 + 单一改动, 端侧 qwen3/hermes3 速度快够用, 云端浪费
- **test_generation**:
  - 首选: `ollama_hermes3` (100 分, 8.95s)
  - 备选: `ollama_gemma4` (100 分, 26.61s)
  - 理由: 需要语法正确 + XCTest API 知识, hermes3 验证 codegen 之王
- **self_review**:
  - 首选: `ollama_hermes3` (100 分, 4.13s)
  - 备选: `ollama_qwen3` (100 分, 22.09s)
  - 理由: 评分要确定性, temperature=0 + JSON 强制的端侧最稳
- **multi_file_refactor**:
  - 首选: `ollama_hermes3` (100 分, 6.86s)
  - 备选: `ollama_gemma4` (77 分, 22.08s)
  - 理由: 长上下文 + 多文件理解, 云端大模型优势明显, 端侧易丢上下文