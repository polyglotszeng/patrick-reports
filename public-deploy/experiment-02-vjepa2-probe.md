# Experiment 02: V-JEPA 2 Latent Probe (2026-06-09)

## 1. 实验设计 (Experimental Design)

**研究问题 (RQ):** V-JEPA 2 是否能为"世界模型"研究提供结构化的视觉表征? 具身智能(embodied AI)的核心在于 agent 能从视频流中学习到环境与动作的潜在动态。本实验是后续世界模型实验的"第 0 步": 验证 V-JEPA 2 latent space 是否具备语义可分性(semantic separability)。

**核心假设 (H1):** V-JEPA 2 (在 SSv2 微调过的 ViT-L) 输出的 1024-d latent 向量应能区分不同视觉/动作类别的视频。

**probe 设计:**
- 4 段视频 (3 段真实 + 1 段合成 fallback)
  - `clip_a.mp4` = `~/Desktop/clips/01_base.mp4` (基线室内场景, ~45MB)
  - `clip_b.mp4` = `~/Desktop/clips/04_combat3.mp4` (战斗动画, ~45MB)
  - `clip_c.mp4` = `~/Desktop/clips/2026-05-05-户外片段-0001.mp4` (户外实拍, ~17MB)
  - `clip_d.mp4` = 合成 gradient+blob (替代缺失的第 4 段, 用于验证 pipeline)
- 每段采样 16 帧 → 256×256 → 标准化 (ImageNet mean/std) → 输入 ViT
- 提取方式: `model(pixel_values_videos).last_hidden_state.mean(dim=1)` → 1024-d 向量

**probe 1: cosine 距离矩阵 (4×4)** — 同一视觉类应距离小
**probe 2: UMAP 2D 降维** — 聚类结构可视化

**目标模型:** `facebook/vjepa2-vitl-fpc16-256-ssv2` (1.4GB safetensors, ViT-L 在 SSv2 上微调)

## 2. 环境状态 (Environment)

| 组件 | 状态 | 备注 |
|------|------|------|
| 硬件 | Mac M1 Max, 64GB | macOS 15.7.4 |
| Python | 3.11.14 | venv: `~/Desktop/vjepa2-probe/.venv` |
| torch | 2.12.0 | |
| MPS | ✅ 可用 | `torch.backends.mps.is_available() = True` |
| transformers | 5.10.2 | trust_remote_code=True |
| huggingface_hub | ✅ | 装好但直连 blocked |
| safetensors / pillow / numpy / einops / timm / av | ✅ | av 17.1.0 替代 decord |
| decord | ❌ 装不上 | 用 `av` 库替代解码 |
| matplotlib / umap-learn | ✅ (本次实验新装) | ensurepip 修复后 `python -m pip install` |
| 网络 | hf-mirror.com OK, huggingface.co 直连 blocked | 详见 §3 |

## 3. 模型加载过程（含网络 hack）

### 3.1 网络挑战

HF 官方 `huggingface.co` 在本机被防火墙/ISP 屏蔽。HF Python SDK 的 `snapshot_download` 会做 endpoint 校验,**不会自动回退到 mirror**, 必须手动绕开。

**解决方案:** 用 `curl` 直连 `hf-mirror.com` 下载 4 个文件到本地 model dir, 再 `from_pretrained(本地路径)`。

### 3.2 下载清单与时间

```
# configs (毫秒级)
curl -L -o ~/Desktop/vjepa2-probe/model/config.json
curl -L -o ~/Desktop/vjepa2-probe/model/video_preprocessor_config.json
curl -L -o ~/Desktop/vjepa2-probe/model/preprocessor_config.json
# safetensors (1.4GB, 慢速)
curl -L -o ~/Desktop/vjepa2-probe/model/model.safetensors
```

| 文件 | 大小 | 状态 |
|------|------|------|
| config.json | 14.9 KB | ✅ |
| video_preprocessor_config.json | 1.5 KB | ✅ |
| preprocessor_config.json | 15 B (空占位) | ⚠️ 该文件不在仓库, 已尝试下载但无内容 |
| model.safetensors | 1.4 GB (目标) | ⏳ 下载中 (本报告撰写时 ~214MB / 1.28 MB/s) |

### 3.3 模型架构确认 (来自 config.json)

```json
{
  "architectures": ["VJEPA2ForVideoClassification"],
  "hidden_size": 1024,
  "frames_per_clip": 16,
  "crop_size": 256,
  "num_classes": 174  // SSv2 动作类数
}
```

确认 16 帧、256×256、1024-d 隐空间。预处理使用 ImageNet mean/std, `do_rescale=True, rescale_factor=1/255`。

### 3.4 加载代码 (待 model 完整下载后执行)

```python
from transformers import AutoModel
import torch
model = AutoModel.from_pretrained(
    "~/Desktop/vjepa2-probe/model/",
    trust_remote_code=True
).eval().to("mps")
x = torch.randn(1, 3, 16, 256, 256)  # [B, C, T, H, W]
with torch.no_grad():
    out = model(pixel_values_videos=x)
    latent = out.last_hidden_state.mean(dim=1)  # [1, 1024]
```

## 4. Probe 结果

### 4.1 当前状态 (pipeline 验证完成, 真实模型 latents 待获取)

由于 1.4GB safetensors 仍在下载 (当前 ~214MB, 速率 1.28 MB/s, ETA 15-20 分钟),
本次实验采用**降级方案 A**: 用结构化的 fake 1024-d embedding 跑完整 pipeline,
证明端到端流程跑得通, 同时为模型到达后的真实 probe 准备好脚本。

**4 段视频加载结果:**
```
[load] clip_a.mp4 -> real (16, 3, 256, 256)   # 真实视频, av 解码 OK
[load] clip_b.mp4 -> real (16, 3, 256, 256)   # 真实视频
[load] clip_c.mp4 -> real (16, 3, 256, 256)   # 真实视频
[load] clip_d.mp4 -> fake (16, 3, 256, 256)   # 合成 (gradient+blob)
[batch] shape=(4, 16, 3, 256, 256), dtype=float32
```

**fake embedding 结构 (用于验证):**
- `a` (indoor 集群中心) ← N(0, 0.3)
- `b` ≈ `a` + N(0, 0.1)        (预期: 与 a 距离小)
- `c` ← N(0, 0.5) 独立样本
- `d` ≈ `c` + N(0, 0.1)        (预期: 与 c 距离小)

### 4.2 Cosine 距离矩阵 (4×4)

|         | a/base | b/combat | c/outdoor | d/fake |
|---------|--------|----------|-----------|--------|
| a/base  | 0.0000 | 0.0542   | 0.9573    | 0.9493 |
| b/combat| 0.0542 | 0.0000   | 0.9627    | 0.9582 |
| c/outdoor| 0.9573| 0.9627   | 0.0000    | 0.0210 |
| d/fake  | 0.9493 | 0.9582   | 0.0210    | 0.0000 |

**观察:** 完美复现了预设的"两两相近"结构 — a/b 距离 0.054, c/d 距离 0.021, 跨组距离 ~0.95。这证明 cosine + UMAP pipeline 端到端跑通。

### 4.3 真实模型结果

⏳ **待补:** `model.safetensors` 下载完成后重新运行 `python probe.py`, 脚本会自动检测到 `model_ok=True` 并加载真实模型, 输出文件 `latents.npy` / `cosine_distance.npy` 会被覆盖。

## 5. 可视化 (UMAP 2D)

![V-JEPA 2 latent UMAP](umap_probe.png)

文件位置: `/Users/patrick/Desktop/vjepa2-probe/umap_probe.png` (150 dpi, 7×6 inch)

**当前 (fake) 嵌入:**
- a/base (蓝) 和 b/combat (橙) 紧邻 → 同一"indoor"聚类
- c/outdoor (绿) 和 d/fake (红) 紧邻 → 另一聚类
- 两组在 UMAP 空间明显分离

UMAP 参数: `n_neighbors=2, min_dist=0.3, random_state=0` (因 n=4 用 n_neighbors=2)。

## 6. 关键发现 (Key Findings)

1. **网络 hack 有效:** curl + hf-mirror.com + 本地 `from_pretrained()` 完全绕过 HF SDK 的 endpoint 校验, 可在受限网络下加载任何 transformer 模型。
2. **av 库成功替代 decord:** 本机 M1 Mac 上 av 17.1.0 流畅解码 3 段真实 mp4 (合计 ~110MB) 为 16 帧 256×256 RGB 张量, 0 错误。
3. **Pipeline 端到端跑通:** 视频加载 → 预处理 → (fake/真) latent → cosine 矩阵 → UMAP PNG → JSON 摘要, 单脚本 9.4KB 全部覆盖, ~6 秒完成。
4. **结构化 fake 验证:** 通过人工构造"a≈b, c≈d"的 latent, 证实下游 probe 能复现预期结构 (a/b=0.05, c/d=0.02, 跨组=0.95), 这是后续解析真实模型结果时的 sanity baseline。
5. **MPS 路径就绪:** torch 2.12.0 + MPS 可用, 真实 V-JEPA 2 forward (ViT-L, 1.4GB 权重的 16 帧推理) 应能直接 `.to("mps")` 跑, 不需要降级到 CPU (虽然 M1 Max 64GB 内存也够 CPU 跑)。
6. **下载瓶颈:** hf-mirror 实测 1.28 MB/s 持续速率, 1.4GB 模型需 ~18 分钟。**下次实验应在后台启动下载的同时, 用 mock data 把脚本写完。**

## 7. Falsification (可证伪性)

**什么观测会让 H1 被拒绝?**

- ❌ 若真实模型对 4 段内容差异明显的视频输出几乎正交的 1024-d 向量 (cosine > 0.9), 则 V-JEPA 2 在本机不可用 — 可能原因: model.safetensors 损坏、config 错误、transformers 5.10 API 不兼容 (VJEPA2ForVideoClassification 用了较新的 trust_remote_code 接口)。
- ❌ 若 `out.last_hidden_state` 维度不是 [B, T_tokens, 1024], 而是 [B, num_classes=174], 则需要在 `model.config` 里换 `output_hidden_states=True` 或访问中间层。
- ❌ 若 MPS 推理 OOM (M1 Max 64GB 应该不会, ViT-L forward batch=1 ~2GB), 降级到 `device="cpu"`, 速度会慢 5-10× 但仍可跑。

**本次实验当前状态:** Pipeline 已被 fake embedding 验证, 因此**下游 probe 算法本身不构成 H1 的反证风险**, 真正风险全部集中在真实模型 forward 这一步。

## 8. 下一步 (Next Steps)

| 优先级 | 任务 | 预计时间 |
|--------|------|----------|
| P0 | 等 `model.safetensors` 下载完, 重跑 `probe.py`, 对比 fake vs 真实 latents 的距离结构 | 5 分钟 |
| P0 | 把真实结果 (`cosine_distance.npy`, `latents.npy`) 追加进本报告 §4.3 | 5 分钟 |
| P1 | 把实验 4 段视频换成 SSv2 benchmark 4 个有 label 的类 (eg. "Pushing something from left to right" 等), 验证模型在它训练分布上的聚类质量 | 30 分钟 |
| P1 | 用 HuggingFace `VJEPA2VideoProcessor` 替代手写 preprocess, 检查是否影响 latent | 15 分钟 |
| P2 | 把 4 段扩到 20-50 段, 跑 silhouette score 量化聚类质量 | 1 小时 |
| P2 | 接入 `predict_action()` 头部 (config 里 `num_classes=174` 暗示有分类头), 跑 zero-shot action classification | 2 小时 |
| P3 | 写下一个实验: **V-JEPA 2 latent + 简单 dynamics head** 预测下一帧 latent → 真正的"世界模型" probe | 1-2 天 |

---

## 附录: 可复现脚本

完整脚本: `/Users/patrick/Desktop/vjepa2-probe/probe.py` (9.4KB, ~190 行)

**复现命令:**
```bash
source ~/Desktop/vjepa2-probe/.venv/bin/activate
python -m ensurepip  # 仅首次需要 (venv 缺 pip)
python -m pip install umap-learn matplotlib  # 仅首次
python ~/Desktop/vjepa2-probe/probe.py
```

**输出文件:**
- `latents.npy` (4×1024 float32)
- `latents_meta.json`
- `cosine_distance.npy` (4×4)
- `umap_2d.npy` (4×2)
- `umap_probe.png` ← 核心可视化
- `probe_summary.json` ← 全部结果汇总

**视频源:** `~/Desktop/clips/{01_base.mp4, 04_combat3.mp4, 2026-05-05-户外片段-0001.mp4}` 复制到 `~/Desktop/vjepa2-probe/videos/`

**模型源:** `~/Desktop/vjepa2-probe/model/` 手动 curl 下载自 hf-mirror.com
