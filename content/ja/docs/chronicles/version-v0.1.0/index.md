---
title: 初公開 v0.1.0
---

- [x] [VRM とのフロントエンド統合 (12 月 5 日)](https://github.com/nekomeowww/airi-vtuber/commit/5738c219b5891f200d7dc9dae04a8e885c8d8c17)
  - [x] [VRM アイドルアニメーション (12 月 6 日)](https://github.com/nekomeowww/airi-vtuber/commit/8f9a0e76cde546952651189229c824c6196caed6)
  - [x] [VRM 瞬き (12 月 7 日)](https://github.com/nekomeowww/airi-vtuber/commit/289f8226696998dae36b550d3a055eba04e160f6)

- [x] 口 (6 月 8 日)
  - [x] [unspeech プロジェクトを作成 (12 月 13 日)](https://github.com/moeru-ai/unspeech)
    - [x] TTS を統合 (6 月 8 日)
    - [x] 11Labs を統合
      - [x] [スタンドアロンの 11Labs パッケージをカプセル化 (12 月 3 日)](https://github.com/nekomeowww/airi-vtuber/commit/f9ddf9af93a61e0a2f3323ced79171f29b6dd2e6)

- [x] 聴覚 (12 月 12 日)
  - [x] トークボタンを実装 (6 月 9 日)
  - [x] ~~音声文字起こし~~
    - [x] ~~フロントエンドが音声をバックエンドにストリーミング~~
      - [x] WebSocket を介した双方向通信に socket.io を使用 [Socket.IO](https://socket.io/) (6 月 10 日)
        - [x] Socket.io は実際には WebSocket に基づいていません
          - [node.js - What is the major scenario to use Socket.IO - Stack Overflow](https://stackoverflow.com/questions/18587104/what-is-the-major-scenario-to-use-socket-io)
          - [node.js - Differences between socket.io and websockets - Stack Overflow](https://stackoverflow.com/questions/10112178/differences-between-socket-io-and-websockets)
        - [x] フロントエンドは `socket.io-client` パッケージを使用、`pnpm i socket.io-client`
          - [x] WebSocket は十分にサポートされており、Nuxt の Nitro もサポートしています。[How to use with Nuxt | Socket.IO](https://socket.io/how-to/use-with-nuxt)
        - [x] バックエンドは `socket.io` パッケージを使用、`pnpm i socket.io`
        - Nuxt 3 with socket.io
          - [richardeschloss/nuxt-socket-io: Nuxt Socket IO - socket.io client and server module for Nuxt](https://github.com/richardeschloss/nuxt-socket-io)
          - [javascript - Socket.io websocket not working in Nuxt 3 when in production - Stack Overflow](https://stackoverflow.com/questions/73592619/socket-io-websocket-not-working-in-nuxt-3-when-in-production)
          - [adityar15/nuxt3socket (github.com)](https://github.com/adityar15/nuxt3socket)
      - [x] ~~音声ストリーミングに WebRTC を使用、VueUse もこれをサポートしています~~
        - [x] Nuxt と Nitro はまだこれをサポートしていないため、今のところスキップします。グループチャットや Discord で検討する可能性があります。
        - チュートリアル：
          - [Getting started with media devices | WebRTC](https://webrtc.org/getting-started/media-devices?hl=en)
          - [WebRTC | JavaScript Standard Reference Tutorial](https://wohugb.gitbooks.io/javascript/content/htmlapi/webrtc.html)
    - ~~Transformers.js + Whisper で十分でしょう~~
      - [x] Chrome / Edge が WebGPU をサポートするようになりました
        - [x] 利用可能なデモがあります: [Real-time Whisper WebGPU - a Hugging Face Space by Xenova](https://huggingface.co/spaces/Xenova/realtime-whisper-webgpu) (今のところオープンソースではありません)
      - [x] ~~Whisper の推論はブラウザで直接実行できます~~
      - [x] ~~WebGPU はまだサポートされていません~~ (現在はサポートされています)
        - [x] [🤗 Transformers.js + ONNX Runtime WebGPU in Chrome extension | by Wei Lu | Medium](https://medium.com/@GenerationAI/transformers-js-onnx-runtime-webgpu-in-chrome-extension-13b563933ca9)
      - ~~Node.js CPP Addon 経由で Whisper.cpp を埋め込むことを検討中~~
      - [whisper.cpp](https://github.com/ggerganov/whisper.cpp)
    - チュートリアル：
      - [Realtime video transcription and translation with Whisper and NLLB on MacBook Air | by Wei Lu | Medium](https://medium.com/@GenerationAI/realtime-video-transcription-and-translation-with-whisper-and-nllb-on-macbook-air-31db4c62c074)
      - [🤗 Transformers.js + ONNX Runtime WebGPU in Chrome extension | by Wei Lu | Medium](https://medium.com/@GenerationAI/transformers-js-onnx-runtime-webgpu-in-chrome-extension-13b563933ca9)
  - [ ] [Whisper WebGPU デモ (12 月 10 日)](https://github.com/moeru-ai/airi/commit/ae3b9468d74c5d38c507ae2877799fd36339f8c1)
  - [ ] [MicVAD デモ (12 月 11 日)](https://github.com/moeru-ai/airi/commit/e4a0cc71006639669e9d71f0db27086fca47a03a)
  - [ ] [MicVAD + ONNX Whisper リアルタイム文字起こし (12 月 12 日)](https://github.com/moeru-ai/airi/commit/01dbaeb9317ab7491743e50dd6c58fc7e19a880d)
  - [ ] [dcrebbin/oai-voice-mode-chat-mac: Adds realtime chat for ChatGPT Voice Mode [Unofficial]](https://github.com/dcrebbin/oai-voice-mode-chat-mac)
- [x] 表情 (7 月 9 日)
  - [x] [フロントエンド VRM 表情制御 (12 月 7 日)](https://github.com/nekomeowww/airi-vtuber/commit/b69abd2b5ab70aa1d72b5e7224f146c8426394eb)

- [ ] 多言語サポート
  - [x] UI 多言語サポート
    - [x] [feat: basic i18n (#2) (12 月 13 日)](https://github.com/moeru-ai/airi/commit/38cda9e957aa4d66bed115ebf96d3d81ce085f68)

- [ ] UI 最適化
  - [x] [Canvas シーンのモバイル対応 (12 月 5 日)](https://github.com/nekomeowww/airi-vtuber/commit/bc04dbaf2ba98f13a367a8dd153cef4a19d1b83d)
    - [x] [Live2D ビューアーの改善 (12 月 5 日)](https://github.com/nekomeowww/airi-vtuber/commit/f6e41e64afdb2592024a24ec2d1de732c4c3d537)
    - [x] [Live2D モデルの拡大縮小と適応比率 (12 月 5 日)](https://github.com/nekomeowww/airi-vtuber/commit/1ce61d7e13fd9dc55a447e513a10e4a08730716c)
  - [x] [画面のセーフエリア (12 月 4 日)](https://github.com/nekomeowww/airi-vtuber/commit/135a8a00fc4d0013d2caec585e8c911817870abc)
  - [x] [設定メニューとオーバーフローの最適化 (12 月 7 日)](https://github.com/nekomeowww/airi-vtuber/commit/e2f1f7bd37757b862d803f3cd77475b436fe8758)

## **モデル**

- **VRM**
  - [`@pixiv/three-vrm`](https://github.com/pixiv/three-vrm/) を教えてくれた [kwaa](https://github.com/kwaa) に感謝します
  - 関連ツールとプラグイン：
    - [VRM Add-on for Blender](https://vrm-addon-for-blender.info/en/)
    - [VRM format — Blender Extensions](https://extensions.blender.org/add-ons/vrm/)
    - [VRM Posing Desktop on Steam](https://store.steampowered.com/app/1895630/VRM_Posing_Desktop/)
    - [Characters Product List | Vket Store](https://store.vket.com/en/category/1)
  - アニメーションサポート：VRM Animation `.vrma`
    - [`vrma` Spec](https://github.com/vrm-c/vrm-specification/tree/master/specification/VRMC_vrm_animation-1.0)
    - [3D Motion & Animation popular doujin goods available online (Booth)](https://booth.pm/en/browse/3D%20Motion%20&%20Animation)
      - [Seven VRM animations (.vrma) - VRoid Project - BOOTH](https://vroid.booth.pm/items/5512385)
        - [VRoid Hub introduces Photo Booth for animation playback! "VRM Animation (.vrma)" now listed on BOOTH, plus 7 free animation files!](https://vroid.com/en/news/6HozzBIV0KkcKf9dc1fZGW)
        - [malaybaku/AnimationClipToVrmaSample: Sample Project to Convert AnimationClip to VRM Animation (.vrma) in Unity](https://github.com/malaybaku/AnimationClipToVrmaSample)
