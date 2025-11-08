# SmashFi Coin List

실시간 코인 시세판을 Next.js 16(App Router)과 React 19로 구현한 프로젝트입니다. “데이터 신뢰성·UI 응답성·구조적 명확성”을 우선 기준으로 설계했습니다.

## 기술 스택

| 영역            | 사용 기술                                                 | 선택 이유                                                                                                                 |
| --------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Framework**   | Next.js 16, React 19, TypeScript                          | App Router 기반으로 서버/클라이언트 경계를 명확히 하면서 ISR·Route Handler를 활용해 동일 리포 안에서 API와 UI를 함께 관리 |
| **데이터/상태** | TanStack Query, Custom Hooks (`useCoins`, `useFavorites`) | 서버 상태는 React Query가 관리하고, 도메인 로직은 훅으로 추상화하여 재사용성과 테스트 용이성 확보                         |
| **스타일**      | Tailwind CSS v4, CSS 변수 테마, tailwindcss-animate       | 글래스모픽 UI를 빠르게 조합하고, CSS 변수만 교체해도 색감/테마를 즉시 변경 가능                                           |
| **UI 유틸**     | react-virtuoso, lucide-react                              | 대용량 리스트 성능 확보 + 일관된 아이콘 세트                                                                              |
| **품질 도구**   | ESLint, TypeScript strict mode                            | 정적 분석과 타입 안전성으로 리팩토링 안정성 보장                                                                          |

## 구조 설계 기준

```
src/
├─ app/                     # App Router 엔트리, layout/providers, API route
│  └─ api/coins/route.ts    # CoinGecko → 클라이언트 중계 + ISR
├─ components/              # Presentational / container 컴포넌트
├─ hooks/                   # 비즈니스 로직(useCoins, useFavorites)
├─ lib/                     # 타입, 유틸, 포맷터, 정렬·검색 로직
└─ lib/mocks/               # API 폴백 데이터
```

1. **관심사 분리**: UI, 데이터, 상태, 유틸을 물리적으로 분리해 변경 영향 범위를 최소화했습니다.
2. **훅 중심 설계**: `useCoins`는 데이터 페칭/캐싱을, `useFavorites`는 로컬 상태와 `localStorage` 동기화를 담당합니다. 컴포넌트는 훅의 계약만 알면 되므로 테스트 더블을 끼워 넣기 쉽습니다.
3. **폴백 전략**: API 장애 시 `MOCK_COINS`를 반환하여 UX가 공백 상태로 남지 않도록 했습니다.

## 데이터 흐름 & 상태 관리

1. **Route Handler (`app/api/coins/route.ts`)**

   - CoinGecko `coins/markets`를 호출하고 `revalidate: 2`로 ISR 캐시를 유지합니다.
   - 실패 시 `MOCK_COINS`를 응답해 프론트 상태가 항상 일관된 스키마를 가지게 합니다.

2. **React Query (`useCoins`)**

   - `staleTime`과 `refetchInterval`을 2초로 맞춰 서버 캐시 주기와 동기화했습니다.
   - `isLoading`, `error`, `data`를 `CoinList`에 전달하여 로딩/에러 UI를 일관되게 처리합니다.

3. **도메인 상태 (`useFavorites`)**

   - `Set<string>`으로 즐겨찾기를 관리해 O(1) 토글/조회 성능을 확보했습니다.
   - `localStorage`와 동기화하여 새로고침 후에도 상태를 복원합니다.

4. **가공 파이프라인 (`CoinList`)**
   - `useMemo`로 필터(검색/탭), 정렬(Price, 24h Change, 24h Volume, Market Cap)을 조합합니다.
   - 검색은 대소문자 구분 없이 `name`/`symbol`에 부분 일치하도록 구성했습니다.

## UI/UX 설계

- **가상 스크롤**: `react-virtuoso`가 뷰포트 안에 필요한 행만 렌더링하여 1만 건 이상의 데이터도 60fps를 유지합니다. 리스트 높이는 뷰포트 기반으로 계산해 화면을 꽉 채웁니다.
- **정렬 헤더**: 네 개의 헤더(Price, 24h Change, 24h Volume, Market Cap)는 클릭 시 ASC/DESC가 토글되고, `ChevronUp` 아이콘 방향으로 시각적 피드백을 줍니다.
- **검색 경험**: 입력 즉시 `processedCoins`가 재계산되어 대/소문자에 상관없이 결과가 반영됩니다.
- **즐겨찾기 UX**: 스타 버튼은 아이콘만 노출하여 피드백을 직관적으로 만들고, 토스트(`Toast` 컴포넌트)로 “성공적으로 추가/삭제” 메시지를 제공합니다.
- **접근성**: 버튼에 `aria-label`, 정렬 헤더에 `aria-pressed`, 토스트에 `role="status"`를 부여해 스크린 리더와 키보드 내비게이션을 지원했습니다.

## 개발 원칙

1. **성능 우선**

   - 메모이제이션과 가상 리스트를 통해 불필요한 연산/렌더를 줄였습니다.
   - Route Handler + React Query의 이중 캐싱으로 네트워크 요청을 최소화했습니다.

2. **타입 안전성**

   - `CoinData`, `SortField`, `SortOrder`, `TabType` 등의 타입을 엄격히 정의해 리팩토링 시 IDE 지원을 극대화했습니다.

3. **예측 가능한 상태**

   - 모든 UI 상태는 훅 또는 React Query를 통해 단일 진실 소스로 관리됩니다.
   - 사이드 이펙트는 `useEffect`로 격리하여 테스트 가능성을 유지했습니다.

4. **확장 용이성**
   - 정렬 필드, 탭, 토스트 메시지 등은 상수/유틸로 정의해 새로운 지표를 쉽게 추가할 수 있습니다.

## 실행 방법

```
npm install
npm run dev
```

`http://localhost:3000` → `/coin-list`로 리다이렉션됩니다. Next.js 16 요구 사항에 따라 Node.js ≥ 20.9 환경에서 실행해야 합니다.

## 향후 개선 계획

1. **실시간 스트림**: WebSocket/SSE를 붙여 2초 폴링 대신 틱 단위 갱신을 지원.
2. **테스트 자동화**: React Testing Library + Playwright로 핵심 시나리오 테스트.
3. **국제화**: 사용자 로케일 기준 통화/숫자 포맷 선택 옵션 제공.
4. **관측성**: Sentry/Honeycomb 등을 붙여 API 실패율과 사용자 액션을 모니터링.

## AI 활용 내역

이 프로젝트는 **Claude Code (Anthropic)** 를 페어 프로그래밍 파트너로 활용하여 개발했습니다.

### 활용 범위와 방식

#### 1. 초기 구조 설계 (80% AI 지원)

- 프로젝트 폴더 구조, 파일 네이밍 컨벤션 설정
- Next.js App Router 기반 라우팅 구조 설계
- TypeScript 타입 정의 및 인터페이스 설계
- Custom Hooks 분리 전략 수립

#### 2. 핵심 로직 구현 (90% AI 작성)

- **데이터 페칭 로직** (`useCoins`, API Route Handler): Claude가 거의 전체 작성
- **상태 관리** (`useFavorites`): Set 자료구조 활용 로직 Claude 제안 및 구현
- **필터링/정렬 유틸** (`lib/utils.ts`): 순수 함수로 분리하는 전략 및 코드 작성
- **가상 스크롤** (react-virtuoso 통합): 라이브러리 선택부터 구현까지 Claude 주도

**제가 한 일:**

- 비즈니스 요구사항 전달 및 엣지 케이스 질문
- 생성된 코드 리뷰 및 테스트
- 성능 이슈 발견 시 피드백

#### 3. UI/UX 구현 (70% AI 작성)

- **컴포넌트 구조**: CoinList, Toast 등 컴포넌트 분리 및 props 설계
- **스타일링**: Tailwind CSS 클래스 조합, CSS 변수 테마 시스템
- **반응형 디자인**: 브레이크포인트 설정 및 모바일 최적화
- **애니메이션**: 토스트 slide-up, 정렬 화살표 회전 등

**제가 직접 조정한 부분:**

- 검색창과 탭의 레이아웃 위치 조정
- 색상, 간격, 폰트 크기 등 세부 디자인
- 호버/포커스 상태 스타일링

#### 4. 문제 해결 및 디버깅 (95% AI 지원)

실제로 발생한 문제들과 해결 과정:

#### 5. 문서화 (100% AI 작성 → 제가 검토/수정)

- **README 작성**: Claude가 초안 작성 → 제가 내용 검토 및 톤 조정
- **코드 주석**: 복잡한 로직에 대한 설명 주석
- **타입 문서화**: JSDoc 스타일 코멘트
