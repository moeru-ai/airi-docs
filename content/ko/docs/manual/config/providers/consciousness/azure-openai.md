---
title: Azure OpenAI
description: AIRI 에서 Azure OpenAI 채팅 모델 설정하기
---

Azure OpenAI 를 사용하면 AIRI 가 여러분의 Azure 리소스 엔드포인트와 배포를 통해 모델에 접근할 수 있습니다.

::: info 왜 Azure OpenAI 를 선택하나요?
팀에서 이미 Azure OpenAI 로 모델을 배포하고 권한을 관리하고 있다면, 가장 간단하게 도입할 수 있는 방법입니다.
:::

## Azure OpenAI 리소스 준비하기

1. [Azure Portal](https://portal.azure.com/)에 로그인한 뒤 Azure OpenAI 리소스를 만들거나 열고 엔드포인트와 API Key 를 확인하세요.

::: warning API Key 보안
Azure API Key 를 커밋하거나, 스크린샷에 포함하거나, 누구와도 공유하지 마세요.
:::

## AIRI 에서 설정하기

1. **설정 → 제공자 → 채팅 → Azure OpenAI**를 열고 **API Key**를 입력하세요.
2. Azure 가 제공하는 전체 Chat Completions URL 을 입력하세요. AIRI 가 URL 에서 배포 이름과 `api-version`을 추출합니다.

## 설정 확인

1. API Key, 엔드포인트, 배포 정보를 입력한 뒤 AIRI 의 자동 유효성 검사를 기다리세요.
2. **설정 → 모듈 → 의식**으로 이동해 Azure OpenAI 와 해당 배포를 선택한 뒤, 메시지를 보내 설정을 확인하세요.

## 문제 해결

유효성 검사가 실패하면 API Key, 엔드포인트, 배포 이름, `api-version`이 모두 같은 Azure OpenAI 리소스에 속하는지 확인하세요. 모델의 표시 이름이 아니라 배포 이름을 사용하세요.
