---
title: Minecraft 에이전트
description: 신뢰할 수 있는 Minecraft 서버에서 AIRI의 로컬 게임 에이전트 실행하기
---

Minecraft 통합은 Mineflayer를 사용해 AIRI를 Minecraft 서버에 연결합니다. 에이전트는 컨텍스트를 받고, 게임 내 행동을 수행하고, 상태를 보고합니다. 이 통합은 로컬 개발과 유지보수 용도로 만들어졌습니다. 현재 구현은 Fabric 런타임으로 이전할 계획입니다. 현재 구현을 기반으로 새로운 장기 기능을 만들지 마세요.

::: warning 소스 설치 필요
Minecraft 에이전트는 현재 소스에서 직접 실행할 때만 동작합니다. [기여자 가이드](/ko/docs/contributing/)를 따라 로컬 개발 환경을 설정하세요.
:::

## 사전 준비 사항

- 저장소 루트에서 의존성을 설치하세요.

```bash
pnpm i
```

- 접속 가능한 로컬 또는 신뢰할 수 있는 Minecraft 서버를 준비하세요. 연결 주소와 포트는 설정 파일에서 가져옵니다.
- 동작하는 AIRI 설정과 모델 서비스 설정을 준비하세요.
- OpenAI 호환 API를 준비하세요.

::: warning 자격 증명 보안
API Key, 서비스 주소, Minecraft 서버 자격 증명은 로컬 **.env.local** 파일에만 보관하세요. 이 값을 커밋하거나, 스크린샷에 포함하거나, 공유하지 마세요.
이 파일의 API Key는 AIRI의 API Key와 별개이며, 서로 호환되지 않습니다. Minecraft 서비스 전용 키를 사용하세요.
:::

## 설정하기

```bash
cp integrations/minecraft/.env integrations/minecraft/.env.local
```

**integrations/minecraft/.env.local**을 편집해 필요한 Minecraft 서버, AIRI, 모델 서비스 설정을 입력하세요.

데스크톱 버전에서 **설정 → 연결**을 여세요. **Auth Token**을 표시한 뒤 복사하세요. 그런 다음 아래 AIRI 채널 설정을 추가하세요:

```env
AIRI_WS_BASEURL=ws://localhost:6121/ws
AIRI_CLIENT_NAME=minecraft-bot
AIRI_WS_TOKEN=<Auth Token from Settings → Connection>
```

또한 서버와 모델 서비스에 필요한 값을 설정하세요. 다음 표는 DeepSeek을 예로 든 것입니다:

| 필드 | 의미 | 안내 |
| --- | --- | --- |
| `OPENAI_API_BASEURL` | 제공자 API의 루트 URL | `https://api.deepseek.com` 같은 URL을 사용하세요. `chat/completions`를 덧붙이지 마세요. |
| `OPENAI_API_KEY` | 제공자가 발급한 액세스 토큰 | 따옴표 안에 전체 키를 붙여넣으세요. |
| `OPENAI_MODEL` | 기본 모델 ID | `deepseek-v4-flash` 같은 범용 모델 ID를 입력하세요. |
| `OPENAI_REASONING_MODEL` | 추론 모델 ID | `deepseek-v4-pro`처럼 추론을 지원하는 더 강력한 모델을 선택하세요. |
| `BOT_USERNAME` | 봇의 게임 내 이름 | 가능하면 영문자, 숫자, 밑줄만 사용하세요. |
| `BOT_HOSTNAME` | 서버 주소 | 서버 주소나 IP를 입력하세요. 로컬 서버라면 `localhost`를 사용하세요. |
| `BOT_PORT` | 서버 포트 | 보통 `25565`를 사용합니다. 서버가 열어 둔 포트를 입력하세요. |
| `BOT_VERSION` | 서버 버전 | `1.21.1`처럼 Minecraft 버전을 입력하세요. |

기본 로그인 방식은 오프라인 모드입니다. Microsoft 계정으로 로그인하려면 **integrations/minecraft/.env**의 주석을 읽어 보세요.

## 시작하기

```bash
pnpm -F @proj-airi/minecraft-bot dev
```

시작하면 에이전트가 AIRI와 Minecraft 서버에 연결됩니다. 개발 환경에서는 터미널 로그를 읽고 연결 상태와 행동 상태를 확인하세요. 게임에서 텍스트 메시지를 보내면 AIRI와 상호작용할 수 있습니다.
`AIRI_WS_TOKEN`이 없거나 잘못되면 모듈이 AIRI에 등록되지 않습니다.

## 보안 및 제한 사항

신뢰할 수 없는 공개 서버에 에이전트를 연결하지 마세요. 에이전트는 로컬 Minecraft 세션과 네트워크 연결을 제어합니다. 행동 계획은 격리된 환경에서 실행될 수 있습니다. 그래도 악의적인 서버는 예기치 않은 동작을 일으킬 수 있습니다.
