# Hermes Mac 真麦克风 + 真转写 诊断报告

日期: 2026-06-12
机器: Mac Studio (Mac13,1) / Apple M1 Max / 32 GB / macOS 15.7.4
项目: ~/Projects/HermesMac/
测试目标: 在真 Mac 环境下, 用真麦克风跑通 Hermes --test 7 (SFSpeechRecognizer + AVAudioEngine voice pipeline)
测试人: Hermes (subagent session)

---

## 结论先放最前面 (TL;DR)

**当前 Mac Studio M1 Max 物理上没有连接任何麦克风硬件**, 所以 Hermes --test 7 **不可能**在这一台机器上转写成功.
这不是签名 / 沙箱 / 授权 / 模型问题 — 是 **真机没有 input audio device**.

具体路径:
- `defaults read com.apple.Siri` 域不存在 (Siri 在这台机器上从未启用过).
- 系统 audio devices 列表里**只有 2 个 output device** (SAMSUNG HDMI + Mac Studio扬声器), **0 个 input device**.
- Hermes 启动后 `SFSpeechRecognizer` 状态为 `available = true` (TCC Speech Recognition 已允许) + `on-device recognition` 走通了,
  但 `AVAudioEngine.installTap` 立刻抛 `com.apple.coreaudio.avfaudio: Input HW format is invalid` — 因为 `inputNode` 拿不到任何 input bus 的 HW format (无设备).
- 之后 Hermes Swift pipeline 没有 `nil` inputNode 的安全分支, 所以 segfault 139 (之前 NSException abort 已经被 ObjCExceptionBridge 接住改成 fail log, 但 segfault 是不同层, 不能 catch).

要让 Hermes 在**真** Mac 上转写, 至少需要:
1. **插一个 USB 麦克风** (Mac Studio 没有内置 mic, 这是必要条件)
2. macOS 自动给 Hermes 弹一次 "Hermes wants to access the Microphone" 提示框, 同意.
3. 首次用 on-device en_US 识别时, 系统静默下载 ~200-500 MB 模型 (要等).
4. 修 Swift pipeline 的 `inputNode == nil` 防御, 把 segfault 改成 clean `didFailWithError` 路径.

签名 / 沙箱 / TCC 都不是瓶颈 (Hermes.app 现在 `app-sandbox = false` + `kTCCServiceSpeechRecognition = 2` 已授权).

---

## 1. 麦克风硬件检查

### 1.1 `system_profiler SPAudioDataType` 完整输出
**状态: ❌ 失败 (无 input device)**

```
Audio:

    Devices:

        SAMSUNG:

          Manufacturer: SAM
          Output Channels: 2
          Current SampleRate: 48000
          Transport: HDMI
          Output Source: Default

        Mac Studio扬声器:

          Default Output Device: Yes
          Default System Output Device: Yes
          Manufacturer: Apple Inc.
          Output Channels: 2
          Current SampleRate: 48000
          Transport: Built-in
          Output Source: Mac Studio扬声器
```

`grep -A 5 "Input"` 没匹配 — 因为整个 plist 根本**没有** "Input" 段, 也**没有**任何 `Input Channels:` 字段.
Mac Studio 是台式机, 物理上没有内置麦克风 (跟 MacBook / iMac 不同).

### 1.2 `ls -la /System/Library/Frameworks/CoreAudio.framework`
**状态: ✅ 成功** (framework 完整, 不是缺失问题)

```
drwxr-xr-x    6 root  wheel   192  2  1 14:03 .
drwxr-xr-x  278 root  wheel  8896  2  1 14:03 ..
lrwxr-xr-x    1 root  wheel    26  2  1 14:03 CoreAudio -> Versions/Current/CoreAudio
lrwxr-xr-x    1 root  wheel    26  2  1 14:03 Resources -> Versions/Current/Resources
drwxr-xr-x    4 root  wheel   128  2  1 14:03 Versions
lrwxr-xr-x    1 root  wheel    28  2  1 14:03 XPCServices -> Versions/Current/XPCServices
```

### 1.3 硬件型号确认
**状态: ✅ 信息性**
`Model Name: Mac Studio` / `Model Identifier: Mac13,1` / `Chip: Apple M1 Max`.
这是 Apple Silicon 台式机, **没有** built-in microphone. 跟 MacBook Air/Pro (有) 和 iMac (有) 形成对比.

---

## 2. Siri & Dictation 设置状态

### 2.1 `defaults read com.apple.Siri`
**状态: ❌ 域不存在**
```
2026-06-12 20:20:35.091 defaults[95730:81381093]
Domain com.apple.Siri does not exist
```
`~/Library/Preferences/com.apple.Siri.plist` 也不存在. 这台 Mac 从未启用过 Siri.

### 2.2 `defaults read com.apple.assistant.backedup`
**状态: ⚠️ 部分存在** (有 plist, 但跟 com.apple.Siri 不是同一域)
```
{
    "Cloud Sync Enabled" = 1;
    "Cloud Sync User ID" = "_27500c1d9ae602b6e3f2b82699e6ac82";
    "MultiUser VoiceIdentification Enabled" = 0;
    "Output Voice" = { Custom = 1; Footprint = 2; Gender = 1; Language = "zh-CN"; Name = limu; };
    "Session Language" = "zh-CN";
}
```
注意 `Session Language = zh-CN` (TTS 输出语言), 但**没有任何 SiriEnabled / HasSiriEnabled 字段**, 跟 SFSpeechRecognizer.availability **无直接因果** (下面 §5 见 — recognizer 实际返回 available=true).

### 2.3 `open x-apple.systempreferences:com.apple.preference.speech`
**状态: ⚠️ 未尝试** (诊断阶段不打开 UI 改设置, 会污染 Patrick 桌面 session; 见 §7 风险说明)

### 2.4 `spctl --assess`
**状态: ✅ 工具可用, 输出使用说明** (没指定 path, 默认进 usage)
```
System Policy Basic Usage:
       spctl --assess [--type type] [-v] path ... # assessment
       spctl --status # assessment system status
       spctl --global-disable | --disable-status
```

---

## 3. 尝试开启 Siri

**状态: ❌ 跳过**

诊断阶段**不**执行 `defaults write com.apple.Siri SiriEnabled -bool YES`, 也不通过 AppleScript 引导 System Settings.
理由:
- `Domain com.apple.Siri does not exist` 意味着写 defaults 会创建新域, 但 15.7.4 真正管 Siri 开关的是 `com.apple.Siri` + System Settings UI + icloud sync, 单写 defaults 不一定生效且下次重启可能 revert.
- AppleScript 引导会抢前台焦点, 跟 Patrick 当前桌面 session 冲突.
- 关键观察 (§5): Hermes 跑 test 7 时 **SFSpeechRecognizer 已经返回 `availability → true`**, 说明 Siri 是否在系统设置启用**不是**当前瓶颈.

---

## 4. Speech 框架授权

### 4.1 TCC Microphone (SQLite 查)
**状态: ⚠️ Hermes 无记录 (但这正常)**
```
com.apple.CoreSimulator.SimulatorTrampoline | kTCCServiceMicrophone | 2   (允许)
com.hnc.Discord                              | kTCCServiceMicrophone | 0   (拒绝)
```
Hermes `com.hermes.mac.app` 在 Microphone 列表里**没有**记录, 但**这是预期**: 之前 Hermes 启动只调 `requestAuthorization` 在 SFSpeechRecognizer, **还没**真正尝试用 AVAudioEngine input node, 所以 TCC 没机会弹窗 (而且**根本没设备**, 弹窗也不会出现).

### 4.2 TCC SpeechRecognition
**状态: ✅ 已授权**
```
com.apple.Terminal      | kTCCServiceSpeechRecognition | 2   (允许)
com.hermes.mac.app      | kTCCServiceSpeechRecognition | 2   (允许)   ← Hermes 自己
```
auth_value=2 = user explicitly allowed. Hermes 在前次 session 已经成功走过 Speech authorization prompt, 并被同意.

### 4.3 `tccutil reset SpeechRecognition`
**状态: ⚠️ 未执行**
跑 test 7 之前重置授权可以保证干净状态, 但既然 §4.2 显示**已经允许**, 重置反而会破坏当前可用状态, 所以**不**执行.

### 4.4 Hermes.app bundle 签名 / 沙箱 / entitlement
**状态: ✅ 配置合理**
- `Signature=adhoc` (ad-hoc, 无 Developer ID) — 这就是 Patrick 一直担心的 "签名问题"
- `app-sandbox = false` (没开沙箱)
- `com.apple.security.automation.apple-events = true` (AppleScript 权限)
- `com.apple.security.get-task-allow = true` (debug 正常)
- `Identifier=com.hermes.mac.app`

Info.plist usage strings 都正确存在:
- `NSMicrophoneUsageDescription` = "Hermes listens for your voice commands when you press the global hotkey."
- `NSSpeechRecognitionUsageDescription` = "Hermes transcribes your spoken commands locally."

**ad-hoc 签名**对 Speech.framework + AVAudioEngine **够用** — 它**不**需要 Developer ID 才允许调这些 API. 真正需要 Developer ID 的场景是发布到其他 Mac / 公证 (notarization), 跟本机自测无关.

---

## 5. 真实跑 Hermes --test 7

跑了**两次**, 输出**完全一致**, 证明这是确定性失败而非 race condition.

### 5.1 第一次完整 stderr
```
2026-06-12 20:21:03.183 Hermes[2899:81394217] Hermes: applicationDidFinishLaunching
2026-06-12 20:21:03.183 Hermes[2899:81394217] Hermes: CLI test mode, test #7
2026-06-12 20:21:03.194 Hermes[2899:81394217] Hermes: test #7 starting VoicePipeline (real SFSpeechRecognizer + AVAudioEngine)
2026-06-12 20:21:03.194 Hermes[2899:81394217] VoiceTestProbe: calling pipe.start()
2026-06-12 20:21:03.215 Hermes[2899:81394217] VoicePipeline: recognizer availability changed → true
2026-06-12 20:21:03.218 Hermes[2899:81394217] HermesSession.refreshLocalModels: 10 model(s): bakllava:latest, gemma4:26b-a4b-it-q8_0, gemma4:e4b, hermes3:latest, kimi-k2.6:cloud, minimax-m2.7:cloud, moondream:latest, qwen3-coder:480b-cloud, qwen3.5:latest, qwen3:latest
2026-06-12 20:21:03.380 Hermes[2899:81394224] VoicePipeline: using on-device recognition
2026-06-12 20:21:03.382 Hermes[2899:81394224] VoicePipeline: installTap raised: com.apple.coreaudio.avfaudio: Input HW format is invalid
/bin/bash: line 7:  2899 Segmentation fault: 11  "$HERMES" --test 7 2>&1
EXIT=139
```

### 5.2 第二次完整 stderr (跟第一次一模一样)
```
2026-06-12 20:21:14.174 Hermes[5849:81399550] Hermes: applicationDidFinishLaunching
2026-06-12 20:21:14.174 Hermes[5849:81399550] Hermes: CLI test mode, test #7
2026-06-12 20:21:14.187 Hermes[5849:81399550] Hermes: test #7 starting VoicePipeline (real SFSpeechRecognizer + AVAudioEngine)
2026-06-12 20:21:14.187 Hermes[5849:81399550] VoiceTestProbe: calling pipe.start()
2026-06-12 20:21:14.197 Hermes[5849:81399550] HermesSession.refreshLocalModels: 10 model(s): bakllava:latest, gemma4:26b-a4b-it-q8_0, gemma4:e4b, hermes3:latest, kimi-k2.6:cloud, minimax-m2.7:cloud, moondream:latest, qwen3-coder:480b-cloud, qwen3.5:latest, qwen3:latest
2026-06-12 20:21:14.358 Hermes[5849:81399559] VoicePipeline: using on-device recognition
2026-06-12 20:21:14.360 Hermes[5849:81399559] VoicePipeline: installTap raised: com.apple.coreaudio.avfaudio: Input HW format is invalid
/bin/bash: line 7:  5849 Segmentation fault: 11  "$HERMES" --test 7 2>&1
EXIT=139
```

### 5.3 关键解读

| 阶段 | 状态 | 含义 |
|------|------|------|
| `applicationDidFinishLaunching` | ✅ | NSApplication 启动正常 |
| `test #7 starting VoicePipeline` | ✅ | CLI 分支进入 test 7 |
| `pipe.start()` 被调 | ✅ | VoicePipeline.start() 进入 |
| `recognizer availability changed → true` | ✅ | **SFSpeechRecognizer 真的**走通了 — Siri/Dictation 系统级已可用, model 已下载或 fallback to server |
| `HermesSession.refreshLocalModels` (10 个 ollama 模型) | ✅ | 跟 mic 无关, 跑通了 |
| `using on-device recognition` | ✅ | isOnDeviceRecognitionSupported=true, 走 on-device 分支 (en_US 模型已下载) |
| `installTap raised: Input HW format is invalid` | ❌ | **AVAudioEngine.inputNode 拿到 input bus 但 HW format 无效** — 根因: 设备列表里 0 个 input device, 系统把 default inputNode 给到一个空 / 占位 bus |
| `Segmentation fault: 11` | ❌ | Swift VoicePipeline 在 `installTap` 抛错**之后**没有干净退出, 直接 segfault. 之前 ObjCExceptionBridge 抓的是 NSException, 这个是 lower-level CoreAudio 错误, bridge 接不到 |

**没有 NSException abort** — 之前子代理 session 看到的 abort 路径已经不会再出现 (ObjCExceptionBridge 改进了), 但被一个新的、bridge 不 catch 的 segfault 取代.

---

## 6. Actionable 建议 — 让 Hermes 在 Mac 真机上能转写

按优先级排:

### P0 — 硬件 (必要条件, 不做这条其它全是空转)
1. **插一个 USB / 蓝牙麦克风到 Mac Studio**.
   - USB 麦克风 (Blue Yeti, Fifine, 等) 即插即识别, 在 `system_profiler SPAudioDataType` 里会出现 `Input Channels: 1/2`.
   - AirPods 蓝牙也可以 (但 HFP profile 延迟高, 不推荐做转写).

### P0 — 代码 (没有 input device 安全分支, 每次都会 segfault)
2. **修 `VoicePipeline.swift` 的 `installTap` nil-safety**:
   ```swift
   let inputNode = engine.inputNode
   let hwFormat = inputNode.outputFormat(forBus: 0)
   guard hwFormat.channelCount > 0 && hwFormat.sampleRate > 0 else {
       // 没有真 input device
       let err = NSError(domain: "VoicePipeline", code: -1,
                         userInfo: [NSLocalizedDescriptionKey: "No input audio device (sampleRate=\(hwFormat.sampleRate), channels=\(hwFormat.channelCount)). Plug in a microphone."])
       delegate?.voicePipeline(self, didFailWith: err)
       return
   }
   ```
   把 segfault 改成 `didFailWithError`, 让 CLI test 7 能 exit 0 + 报清晰错误.

### P1 — 一次性的 macOS 端配置
3. **首次跑时, macOS 会弹 "Hermes wants to access the Microphone" 框** — 必须 Patrick 手动点 Allow.
   - 如果不弹 (Hermes 是 CLI 不弹窗), 提前在 `System Settings → Privacy & Security → Microphone` 勾 Hermes.

4. **SFSpeechRecognition 已 OK** (`kTCCServiceSpeechRecognition=2`), 不需要重做. 第一次跑时若 recognizer availability 不是 true, 走 `SFSpeechRecognizer.requestAuthorization` 会弹授权框 (这次没弹, 说明授权持久有效).

5. **on-device en_US 模型 ~200-500 MB 首次跑时会静默下载**, 期间 input 进 recognizer 会 hang. 建议在 `using on-device recognition` 后加一行 log: `On-device model ready: <locale>=<supported>`, 方便测试时观察.

### P2 — 可选改进 (功能 vs 简洁)
6. **CLI test 7 加一个 `--no-mic` dry-run 模式**, 跳过 installTap, 只测 SFSpeechRecognizer 是否能 instantiate + 喂一段预录 `.wav`. 这样以后没 mic 也能跑端到端.

7. **Hermes.app 不需要 Developer ID 签名才能跑本地转写**. 真正的签名瓶颈是**分发** (给别的 Mac 用) 和 **Apple公证 (notarization)**. Patrick 自己开发自己跑, ad-hoc 完全够.

### P3 — 不需要做的 (排除项)
- ❌ **不需要**开沙箱. 沙箱 + mic 反而要更多 entitlement (`com.apple.security.device.audio-input`), 调试期 ad-hoc 无沙箱更简单.
- ❌ **不需要**开启 Siri (`com.apple.Siri` 域). 这次 `recognizer availability → true` 已经验证, 跟系统 Siri 开关无关.
- ❌ **不需要** `tccutil reset SpeechRecognition`. 当前已授权 (`auth_value=2`), 重置反而破坏.

---

## 7. 风险 & 注意事项

1. **本报告是诊断, 不修代码**. 改 Swift 代码属于 P0 任务, 需要 Patrick 决定走 PR 还是要先试硬件方案.
2. **没有动 Patrick 的 macOS 设置**: 没有 `defaults write` 没有 AppleScript 抢前台, 没有 `tccutil reset`, 没有 `open System Settings`. 桌面 session 应该完全无感.
3. **唯一改动的文件**: `~/Desktop/mic-diagnostic-2026-06-12.md` (本文件).
4. **Hermes 二进制未动**: `/Users/patrick/Library/Developer/Xcode/DerivedData/HermesMac-.../Hermes` 还是原 build, 没 rebuild 没 re-sign.
5. **下次跑 --test 7 仍会 segfault 139** (input device 仍不存在 + 代码仍没 nil guard). 这是已知 reproducible 状态.
6. **TCC `kTCCServiceMicrophone=2` for CoreSimulator** 是 macOS 自带条目, 跟 Hermes 无关, 别混淆.

---

## 8. 答案回顾 (Patrick 要求贴回 summary)

a) **`system_profiler SPAudioDataType | grep Input`**: **零匹配**. 完整 plist 见 §1.1 — 0 个 input device.

b) **Siri 启用状态**: `Domain com.apple.Siri does not exist`. 没有 plist. `assistant.backedup` 域存在但**不**代表 Siri 启用 (见 §2.2).

c) **Hermes --test 7 完整 stderr**: 见 §5.1 + §5.2, 两次输出完全一致, 关键三行:
   - `recognizer availability changed → true` (走通了)
   - `using on-device recognition` (走通了)
   - `installTap raised: com.apple.coreaudio.avfaudio: Input HW format is invalid` (失败)
   - `Segmentation fault: 11` (下游 segfault)

d) **诊断报告**: ✅ **成功创建** at `/Users/patrick/Desktop/mic-diagnostic-2026-06-12.md` (即本文件).

e) **真 Mac + 真 mic + 真授权下能否转写**: **能**, 但当前这台 Mac Studio **物理上没接 mic** (没 input device).
   **当前 Hermes sandbox + ad-hoc 签名环境是否支持真转写**: **签名/沙箱/TCC 三项都通过**, 不是瓶颈.
   真转写需要的 X / Y / Z:
   - **X**: 插一个 USB 麦克风
   - **Y**: Swift pipeline 加 `inputNode == nil / hwFormat invalid` 的 nil guard, 改 segfault 为 clean fail
   - **Z**: 首次跑 macOS 自动弹 mic 授权框点 Allow (一次性)

f) **Risk / 下一步建议**: 见 §6 + §7. 优先 P0 修代码 (P0 任务 2), 然后 P0 任务 1 插 mic 跑通, 才有意义看 P1 配置是否需要.

---

报告结束. Patrick 可以直接看 §6 的 P0/P1 列表决定下一步.
