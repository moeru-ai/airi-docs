---
title: Mistral
description: AIRI 에서 Mistral 을 채팅 제공자로 설정하기
is_openai_compatible: true
---

Mistral 은 OpenAI 형식과 호환되는 채팅 API 를 제공합니다. 이 페이지의 설정을 마치면 AIRI 는 의식에서 Mistral 이 제공하는 모델을 사용할 수 있습니다.

::: info 왜 Mistral 을 선택하나요?
이미 Mistral 모델을 사용하고 있거나 AIRI 에서 Mistral 의 다국어 모델을 사용해 보고 싶다면 이 제공자를 선택할 수 있습니다.
:::

## API Key 발급받기

1. [Mistral Console](https://console.mistral.ai/)을 여세요.
2. API Keys 페이지에서 새 API Key 를 생성하세요.
3. 키를 복사해 안전한 곳에 보관하세요.

::: warning API Key 보안
API Key 를 커밋하거나, 스크린샷에 포함하거나, 누구와도 공유하지 마세요. 키가 유출되면 즉시 폐기하고 Mistral 콘솔에서 새 키를 만드세요.
:::

## AIRI 에서 설정하기

1. **설정 → 제공자 → 채팅 → Mistral**을 여세요.
2. 기본 설정에 API Key 를 붙여 넣으세요.
3. 기본 Base URL 인 `https://api.mistral.ai/v1/`를 유지하세요.

## 설정 확인

1. **설정 유효성 검사**: AIRI 는 설정을 수정하는 동안 자동으로 유효성을 검사합니다. **Ping API** 버튼이 보이면 실제 요청 테스트에 사용할 수 있습니다.
2. **모델 선택 →**: 유효성 검사가 통과되면 이 버튼으로 **설정 → 모듈 → 의식**을 열어 제공자와 모델을 선택하세요.

## 문제 해결

API 확인이 실패하면 API Key, 사용 가능한 크레딧 또는 할당량, 요청 한도, 네트워크 연결을 확인하세요. AIRI 가 모델 목록을 불러오지 못하면 **의식** 페이지에서 Mistral 이 제공하는 정확한 모델 ID 를 직접 입력하세요.
