# yjsprompt

A Chrome side-panel extension that transforms your natural language into powerful, optimized AI prompts — instantly.

Built by [Mark Yang (양준서)](https://github.com/markyang0613)

---

## ⚠️ Chrome Web Store Notice

This extension is **not published on the Chrome Web Store**. You must install it manually using Chrome's Developer Mode (instructions below).

---

## Installation

### Step 1 — Download the extension

1. Click the green **Code** button at the top of this repository.
2. Select **Download ZIP** and save it to your computer.
3. **Unzip** the downloaded file to a folder you can find easily.

### Step 2 — Load it into Chrome

1. Open Chrome and go to `chrome://extensions` in the address bar.
2. Toggle on **Developer mode** (top-right corner).
3. Click **Load unpacked**.
4. Select the unzipped `yjsprompt-main` folder.
5. The yjsprompt icon will appear in your Chrome toolbar.

### Step 3 — Open the side panel

1. Click the **yjsprompt (⚡)** icon in the Chrome toolbar.
2. The side panel opens on the right side of your browser — it works on any webpage.

---

## How to use

1. **Select a Mode** — pick the type of task you are working on (see the Mode table below).
2. **Describe your need** — type naturally in the input box (up to 1,000 characters). No need to be precise; write as you would in a chat.
3. **Click "Generate Prompt"** — the extension rewrites your input into a well-structured, optimized prompt.
4. **Copy & paste** — click **📋 Copy** and paste the result into ChatGPT, Claude, Gemini, or any other AI tool to get a much better answer.

---

## Modes

| Mode | Best for |
|------|----------|
| **General** | Everyday questions and mixed tasks |
| **Coding** | Programming, debugging, code review, refactoring |
| **Writing** | Blog posts, emails, essays, LinkedIn posts, cover letters |
| **Analysis** | SWOT, root-cause analysis, cost/benefit, decision review |
| **Brainstorming** | Generating and expanding ideas creatively |
| **Research** | In-depth answers with source citations and structure |

---

## Tech stack

- Chrome Extension Manifest V3
- Vanilla JavaScript (ES Modules)
- OpenAI API (`gpt-4o-mini`) via the Responses endpoint
- `chrome.storage.local` for persisting mode preference

---

---

## 한국어 안내

### ⚠️ Chrome 웹 스토어 미출시 안내

이 확장 프로그램은 **Chrome 웹 스토어에 출시되어 있지 않습니다.**
아래 안내에 따라 Chrome 개발자 모드를 통해 수동으로 설치해야 합니다.

---

### 설치 방법

**1단계 — 확장 프로그램 다운로드**

1. 이 GitHub 저장소 페이지 상단의 초록색 **Code** 버튼을 클릭합니다.
2. **Download ZIP** 을 선택하고 컴퓨터에 저장합니다.
3. 다운로드된 ZIP 파일의 **압축을 풉니다.**

**2단계 — Chrome에 로드**

1. Chrome 주소창에 `chrome://extensions` 를 입력하고 이동합니다.
2. 오른쪽 상단의 **개발자 모드** 토글을 켭니다.
3. **압축해제된 확장 프로그램을 로드합니다** 버튼을 클릭합니다.
4. 압축을 푼 `yjsprompt-main` 폴더를 선택합니다.
5. Chrome 툴바에 yjsprompt 아이콘이 나타납니다.

**3단계 — 사이드 패널 열기**

1. Chrome 툴바에서 **yjsprompt (⚡)** 아이콘을 클릭합니다.
2. 브라우저 오른쪽에 사이드 패널이 열립니다. 어떤 웹페이지에서도 사용할 수 있습니다.

---

### 사용 방법

1. **모드 선택** — 작업 유형에 맞는 모드를 선택합니다 (아래 모드 표 참고).
2. **원하는 내용 입력** — 입력창에 자연스러운 언어로 원하는 것을 적습니다 (최대 1,000자). 정확하게 쓸 필요 없이 채팅하듯 자유롭게 적으면 됩니다.
3. **"Generate Prompt" 클릭** — 입력 내용을 구조화된 최적 프롬프트로 자동 변환합니다.
4. **복사 후 붙여넣기** — **📋 Copy** 버튼을 클릭하고, ChatGPT, Claude, Gemini 등 원하는 AI 도구에 붙여넣으면 훨씬 더 좋은 답변을 받을 수 있습니다.

---

### 모드 안내

| 모드 | 최적 용도 |
|------|----------|
| **General** | 일반적인 질문 및 혼합 작업 |
| **Coding** | 프로그래밍, 디버깅, 코드 리뷰, 리팩토링 |
| **Writing** | 블로그, 이메일, 에세이, LinkedIn 포스트, 자기소개서 |
| **Analysis** | SWOT, 근본 원인 분석, 비용-효익, 의사결정 검토 |
| **Brainstorming** | 아이디어 발굴 및 창의적 확장 |
| **Research** | 출처 인용이 포함된 심층 조사 답변 |

---

*Made by [Mark Yang](https://github.com/markyang0613)*
