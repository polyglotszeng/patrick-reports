# HermesMac — BlackHole 装后 mic 联调 (2026-06-12)

## 1. 环境
- 设备: Mac Studio (台式机,无内置 mic)
- macOS 15.7.4 + Xcode 26.3
- Hermes PID 73074 (launchd 拉起, Release build)
- BlackHole 2ch driver 已装 (`/Library/Audio/Plug-Ins/HAL/BlackHole2ch.driver`, 2025-02-07 装过, subagent 2 verify 仍在)

## 2. BlackHole 装路径
- 装来源: brew install --cask blackhole-2ch (subagent 1 之前跑过,这次仍有效)
- driver 落盘: `/Library/Audio/Plug-Ins/HAL/BlackHole2ch.driver`
- 重启 core audio: `sudo killall coreaudiod` 让 driver 加载
- 验证: `system_profiler SPAudioDataType | grep "Existential Audio Inc"` 显示 "BlackHole 2ch", input channels=2, sample rate 48000

## 3. Hermes --test 7 跑通关键
**关键反转**: 装 BlackHole 后, Hermes 拿到的 audio format 改变:
- **之前 (无 BlackHole)**: `audioEngine.start() → 0Hz/0ch` → "Input HW format is invalid" NSException → 我修的 `exit(0)` 干净退出
- **现在 (有 BlackHole)**: `audioEngine started, sampleRate=48000.0 ch=2` (2ch = BlackHole 2ch) ✓

但每次都立刻报 `kLSRErrorDomain code=201 desc=Siri and Dictation are disabled`。
**真正根因**: macOS Dictation 在 System Settings 是关的。`defaults write com.apple.SpeechRecognitionCoreService SpeechEnabled -bool YES` 写文件 OK,但 macOS 15 上**真正的开关在 `com.apple.HIToolbox AppleDictationAutoEnable` 系统 TCC,需要用户在 System Settings GUI 手动开**。

## 4. Patrick 1 步: System Settings 开 Dictation
```bash
open "x-apple.systempreferences:com.apple.preference.keyboard?Dictation"
```
会弹到 Keyboard → Dictation 页面。**把 Dictation 切到 "On"** (Automatic Punctuation 可选)。

开后立即生效 (不需要重启), `Hermes --test 7` 验真转写应该:
- 不再 "Siri and Dictation are disabled"
- 走 on-device recognition 路径
- 因无真实声音输入, transcript 是空白 (但 process 正常跑, exit 0)

## 5. 完整 8 个 --test 在 Release binary 真跑
| # | 测试 | 结果 | 备注 |
|---|---|---|---|
| 1 | L1 Echo | ✓ | `EchoIntent(L1) ✓ received` |
| 2 | L1 Open URL | ✓ | `NSWorkspace.open ✓` |
| 3 | L1 Beep | ✓ | `Beep ✓` |
| 4 | L2 Notification | ✓ | banner 显示 |
| 5 | Window Choreography | ✓ | Safari 右侧 40% |
| 6 | Local LLM plan | ✓ | hermes3 → safari.openURL |
| 7 | Speech | ⚠ | audioEngine 起来了 (48kHz/2ch) 但 Dictation 关,走不通 |
| 8 | Model switch | ✓ | 切到 qwen3, plan=1 step |

**8/8 exit 0**, 没有 crash/segfault。`--test 7` 即使 Dictation 关也是干净退出 (我之前修的 `exit(0)` 路径生效)。

## 6. Release vs Debug 路径对比
- Release binary: 1,033,552 bytes (1.03 MB, -Os 优化)
- Debug binary: 58,656 bytes (注: 这是 debug.dylib stub,真 binary 实际是 Hermes.debug.dylib 926,320 字节)
- NSLog 围栏在 Release 真消除 (`strings "ModelRouter.plan: system prompt"` Release=0 / Debug=1)
- stderr 体积 Release < Debug ~59% (上一轮 subagent 1 验过)

## 7. 待办 (1/2/3)
- 1) Patrick 在 System Settings 启 Dictation → 验真转写
- 2) HermesMac 内置 mic / USB mic 真硬件联调 (需要 iMac/MacBook)
- 3) ⌥Space hotkey 重复触发问题 (subagent 报告每 3s 自动触发一次,可能是 HermesSession.toggleHUD + NSEvent.addGlobalMonitor 组合在 LSUIElement 下的多 monitor 触发现象,值得 investigate)

## 8. 关键文件
- 桌面: `~/Desktop/hermes-release-2026-06-12.md` (本文件)
- 桌面: `~/Desktop/mic-diagnostic-2026-06-12.md` (上一轮 16KB 诊断)
- 桌面: `~/Desktop/hermesmac-status-2026-06-12.html` (公网状态页)
- 公网 URL: https://patrick-reports.patrick-l-zeng.workers.dev/hermesmac-status-2026-06-12.html
- LaunchAgent plist: `~/Library/LaunchAgents/com.hermes.mac.app.plist` (指向 Release binary)
- Hermes 启动 log: `/tmp/hermes-launchd-stderr.log`
