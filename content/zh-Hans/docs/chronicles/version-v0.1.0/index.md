# 编年史 v0.1.0

- [x] [前端集成 VRM（12 月 5 日）](https://github.com/nekomeowww/airi-vtuber/commit/5738c219b5891f200d7dc9dae04a8e885c8d8c17)
  - [x] [VRM 闲置动画（12 月 6 日）](https://github.com/nekomeowww/airi-vtuber/commit/8f9a0e76cde546952651189229c824c6196caed6)
  - [x] [VRM 眨眼睛（12 月 7 日）](https://github.com/nekomeowww/airi-vtuber/commit/289f8226696998dae36b550d3a055eba04e160f6)

- [x] 嘴巴（6 月 8 日）
  - [x] [创建 unspeech 项目（12 月 13 日）](https://github.com/moeru-ai/unspeech)
    - [x] 接入 TTS（6 月 8 日）
    - [x] 接了 11Labs
      - [x] [封装独立的 11Labs 类型包（12 月 3 日）](https://github.com/nekomeowww/airi-vtuber/commit/f9ddf9af93a61e0a2f3323ced79171f29b6dd2e6)

- [x] 听觉（12 月 12 日）
  - [x] 实现说话按钮（6 月 9 日）
  - [x] ~~音频转写文字~~
    - [x] ~~前端音频串流给后端~~
      - [x] 使用 socket.io 通过 WebSocket 做双向通信 [Socket.IO](https://socket.io/)（6 月 10 日）
        - [x] socket.io 其实并不是基于 WebSocket 的
          - [node.js - What is the major scenario to use Socket.IO - Stack Overflow](https://stackoverflow.com/questions/18587104/what-is-the-major-scenario-to-use-socket-io)
          - [node.js - Differences between socket.io and websockets - Stack Overflow](https://stackoverflow.com/questions/10112178/differences-between-socket-io-and-websockets)
        - [x] 前端用 `socket.io-client` 包，`pnpm i socket.io-client`
          - [x] WebSocket 支持比较好，Nuxt 用的 Nitro 也支持，[How to use with Nuxt | Socket.IO](https://socket.io/how-to/use-with-nuxt)
        - [x] 后端用 `socket.io` 包，`pnpm i socket.io`
        - Nuxt 3 与 socket.io
          - [richardeschloss/nuxt-socket-io: Nuxt Socket IO - socket.io client and server module for Nuxt](https://github.com/richardeschloss/nuxt-socket-io)
          - [javascript - Socket.io websocket not working in Nuxt 3 when in production - Stack Overflow](https://stackoverflow.com/questions/73592619/socket-io-websocket-not-working-in-nuxt-3-when-in-production)
          - [adityar15/nuxt3socket (github.com)](https://github.com/adityar15/nuxt3socket)
      - [x] ~~使用 WebRTC 做音频串流，VueUse 也支持~~
        - [x] Nuxt 和 Nitro 好像还没有支持，暂时不做这步吧，群聊或者 Discord 的时候可以考虑
        - 教程
          - [媒体设备使用入门 | WebRTC](https://webrtc.org/getting-started/media-devices?hl=zh-cn)
          - [WebRTC | JavaScript 标准参考教程](https://wohugb.gitbooks.io/javascript/content/htmlapi/webrtc.html)
    - ~~Transformers.js + Whisper 即可~~
      - [x] 现在 Chrome / Edge 已经支持 WebGPU
        - [x] 有 [Real-time Whisper WebGPU - a Hugging Face Space by Xenova](https://huggingface.co/spaces/Xenova/realtime-whisper-webgpu) 这个 Demo 可以参考，暂时没有开源
      - [x] ~~Whisper 直接在浏览器里面推理就可以了~~
      - [x] ~~WebGPU 暂时不支持~~支持了
        - [x] [🤗 Transformers.js + ONNX Runtime WebGPU in Chrome extension | by Wei Lu | Medium](https://medium.com/@GenerationAI/transformers-js-onnx-runtime-webgpu-in-chrome-extension-13b563933ca9)
      - ~~综上所述，转 whisper.cpp 的嵌入式 Node.js CPP Addon 的方案~~
      - [whisper.cpp](https://github.com/ggerganov/whisper.cpp)
    - 教学
      - [Realtime video transcription and translation with Whisper and NLLB on MacBook Air | by Wei Lu | Medium](https://medium.com/@GenerationAI/realtime-video-transcription-and-translation-with-whisper-and-nllb-on-macbook-air-31db4c62c074)
      - [🤗 Transformers.js + ONNX Runtime WebGPU in Chrome extension | by Wei Lu | Medium](https://medium.com/@GenerationAI/transformers-js-onnx-runtime-webgpu-in-chrome-extension-13b563933ca9)
  - [ ] [Whisper WebGPU Demo（12 月 10 日）](https://github.com/moeru-ai/airi/commit/ae3b9468d74c5d38c507ae2877799fd36339f8c1)
  - [ ] [MicVAD Demo（12 月 11 日）](https://github.com/moeru-ai/airi/commit/e4a0cc71006639669e9d71f0db27086fca47a03a)
  - [ ] [MicVAD + ONNX Whisper 实时转写（12 月 12 日）](https://github.com/moeru-ai/airi/commit/01dbaeb9317ab7491743e50dd6c58fc7e19a880d)
  - [ ] [dcrebbin/oai-voice-mode-chat-mac: Adds realtime chat for ChatGPT Voice Mode [Unofficial]](https://github.com/dcrebbin/oai-voice-mode-chat-mac)
- [x] 表情（7 月 9 日）
  - [x] [前端侧 VRM 表情控制（12 月 7 日）](https://github.com/nekomeowww/airi-vtuber/commit/b69abd2b5ab70aa1d72b5e7224f146c8426394eb)

- [ ] 多语言
  - [x] 界面多语言支持
    - [x] [feat: basic i18n (#2)（12 月 13 日）](https://github.com/moeru-ai/airi/commit/38cda9e957aa4d66bed115ebf96d3d81ce085f68)

- [ ] 界面优化
  - [x] [Canvas 场景移动端自适应（12 月 5 日）](https://github.com/nekomeowww/airi-vtuber/commit/bc04dbaf2ba98f13a367a8dd153cef4a19d1b83d)
    - [x] [Live2D Viewer 改进（12 月 5 日）](https://github.com/nekomeowww/airi-vtuber/commit/f6e41e64afdb2592024a24ec2d1de732c4c3d537)
    - [x] [Live2D 模型放大和自适应比例（12 月 5 日）](https://github.com/nekomeowww/airi-vtuber/commit/1ce61d7e13fd9dc55a447e513a10e4a08730716c)
  - [x] [屏幕安全区（12 月 4 日）](https://github.com/nekomeowww/airi-vtuber/commit/135a8a00fc4d0013d2caec585e8c911817870abc)
  - [x] [设置菜单 & 优化溢出（12 月 7 日）](https://github.com/nekomeowww/airi-vtuber/commit/e2f1f7bd37757b862d803f3cd77475b436fe8758)

## Models

- VRM
  - 感谢 [kwaa](https://github.com/kwaa) 的 [`@pixiv/three-vrm`](https://github.com/pixiv/three-vrm/) 指路
  - 相关工具和插件：
    - [VRM Add-on for Blender](https://vrm-addon-for-blender.info/en/)
    - [VRM format — Blender Extensions](https://extensions.blender.org/add-ons/vrm/)
    - [Steam 上的 VRM Posing Desktop](https://store.steampowered.com/app/1895630/VRM_Posing_Desktop/)
    - [Characters Product List | Vket Store](https://store.vket.com/en/category/1)
  - 动画支持：VRM Animation `.vrma`
    - [`vrma` Spec](https://github.com/vrm-c/vrm-specification/tree/master/specification/VRMC_vrm_animation-1.0)
    - [3D Motion & Animation の人気の同人グッズ 1283 点を通販 - BOOTH](https://booth.pm/en/browse/3D%20Motion%20&%20Animation)
      - [VRM アニメーション 7 種セット（.vrma） - VRoid Project - BOOTH](https://vroid.booth.pm/items/5512385)
        - [VRoid Hub introduces Photo Booth for animation playback! "VRM Animation (.vrma)" now listed on BOOTH, plus 7 free animation files!](https://vroid.com/en/news/6HozzBIV0KkcKf9dc1fZGW)
        - [malaybaku/AnimationClipToVrmaSample: Sample Project to Convert AnimationClip to VRM Animation (.vrma) in Unity](https://github.com/malaybaku/AnimationClipToVrmaSample)
