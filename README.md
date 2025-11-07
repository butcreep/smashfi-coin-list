# SmashFi Coin List

암호화폐 목록을 조회하고 즐겨찾기를 관리할 수 있는 웹 애플리케이션입니다.

## 🛠 사용한 기술 스택

### Core
- **Next.js 16** - React 프레임워크 (App Router)
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성

### UI/UX
- **Tailwind CSS 4** - 유틸리티 기반 CSS 프레임워크
- **shadcn/ui** - 재사용 가능한 컴포넌트 라이브러리
- **Lucide React** - 아이콘 라이브러리

### State & Data
- **TanStack Query (React Query)** - 서버 상태 관리 및 캐싱
- **Local Storage** - 즐겨찾기 데이터 영구 저장

### Performance Optimization
- **react-virtuoso** - 가상 스크롤링 (대용량 데이터 최적화)

### API
- **CoinGecko API** - 실시간 암호화폐 데이터

## 🚀 프로젝트 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 브라우저에서 확인
[http://localhost:3000](http://localhost:3000) 접속

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 📋 구현한 주요 요소

### ✅ 필수 구현 사항

#### 1. **API 연동**
- CoinGecko API를 사용한 실시간 데이터 페칭
- Next.js API Route를 통한 프록시 구현 (`/api/coins/route.ts`)
- API 실패 시 Mock 데이터 Fallback 처리
- React Query를 통한 자동 리페칭 (60초마다)

#### 2. **페이지 라우팅**
- 루트 경로(`/`) → `/coin-list` 자동 리다이렉트
- Next.js App Router 활용

#### 3. **초기 정렬**
- Price 기준 내림차순 정렬로 시작

#### 4. **탭 시스템**
- **All**: 전체 코인 목록
- **My favorite**: 즐겨찾기한 코인만 필터링
- 탭 전환 시 실시간 리스트 업데이트

#### 5. **검색 기능**
- 코인 심볼(BTC) 또는 이름(Bitcoin) 검색
- 대소문자 구분 없는 검색
- 실시간 필터링

#### 6. **리스트 구현**
각 코인은 다음 정보를 포함:
- 심볼 (Symbol)
- 이름 (Name)
- 코인 이미지
- 현재 가격 (Price)
- 24시간 변동률 (24h Change) - 색상으로 구분
- 24시간 거래량 (24h Volume)
- 시가총액 (Market Cap)

#### 7. **즐겨찾기 기능**
- 별 아이콘 클릭으로 추가/제거
- LocalStorage에 저장하여 새로고침 후에도 유지
- 토스트 메시지 표시:
  - 추가: "Successfully added!"
  - 제거: "Successfully deleted!"

#### 8. **정렬 기능**
- 정렬 가능한 헤더: Price, 24h Change, 24h Volume, Market Cap
- 클릭 시 오름차순/내림차순 토글
- 시각적 정렬 방향 인디케이터

### ✅ 선택 구현 사항

#### 1. **대용량 데이터 최적화**
- **react-virtuoso**를 사용한 가상 스크롤링 구현
- 10,000개 이상의 데이터도 부드럽게 렌더링
- DOM 노드를 최소화하여 메모리 사용량 감소
- 뷰포트에 보이는 항목만 렌더링
- 자동 높이 조정 및 동적 스크롤링 최적화

**최적화 전략:**
- **가상 스크롤링**: 화면에 보이는 항목만 렌더링
- **useMemo 훅**: 필터링/정렬된 데이터 메모이제이션
- **React Query 캐싱**: 불필요한 API 호출 방지 (60초 staleTime)

#### 2. **반응형 디자인**
- 모바일 전용 레이아웃 구현
- 데스크톱 전용 레이아웃 구현
- Tailwind CSS 브레이크포인트 활용 (md:)
- 모바일: 컴팩트한 2열 레이아웃 (별/아이콘/정보 | 가격/변동률)
- 데스크톱: 전체 정보를 표시하는 5열 테이블 레이아웃
- 모바일 최적화된 텍스트 크기 및 간격

#### 3. **다크 테마**
- CSS 변수를 활용한 다크 테마 구현
- 일관된 색상 시스템 적용
- 커스텀 색상 팔레트:
  - 배경: `#0B0F14`, `#0F172A`
  - 텍스트: `#E5E7EB`, `#9CA3AF`
  - 상태: 성공(`#22C55E`), 위험(`#EF4444`), 정보(`#3B82F6`)
  - 별 아이콘: 활성(`#FACC15`), 비활성(`#9CA3AF`)

## 🎨 주요 기술적 결정

### 1. **상태 관리 구조**
- **서버 상태**: React Query로 관리 (API 데이터)
- **클라이언트 상태**: React Hooks로 관리 (검색어, 정렬, 탭)
- **영구 상태**: LocalStorage로 관리 (즐겨찾기)

### 2. **컴포넌트 구조**
```
src/
├── app/
│   ├── api/coins/route.ts      # API 프록시
│   ├── coin-list/page.tsx      # 코인 리스트 페이지
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈 (리다이렉트)
│   └── providers.tsx           # React Query Provider
├── components/
│   ├── CoinList.tsx            # 메인 코인 리스트 컴포넌트
│   └── Toast.tsx               # 토스트 알림
├── hooks/
│   ├── useCoins.ts             # 코인 데이터 페칭
│   └── useFavorites.ts         # 즐겨찾기 관리
└── lib/
    ├── types.ts                # TypeScript 타입 정의
    └── utils.ts                # 유틸리티 함수
```

### 3. **성능 최적화**
- 가상 스크롤링으로 대용량 데이터 처리
- React Query의 staleTime으로 불필요한 재요청 방지
- useMemo를 통한 연산 최적화

### 4. **디자인 시스템**
- shadcn/ui 컴포넌트 라이브러리 도입
- Lucide React 아이콘 사용
- 일관된 컴포넌트 스타일링
- CSS 변수 기반 테마 시스템

## 🎯 주요 기능

### 코인 목록 표시
- CoinGecko API에서 250개 코인 데이터 실시간 페칭
- 가상 스크롤링으로 부드러운 리스트 렌더링
- 모바일/데스크톱 반응형 레이아웃

### 검색 및 필터링
- 실시간 검색 (코인 이름 또는 심볼)
- 탭 기반 필터링 (All / My favorite)
- 검색 결과 즉시 반영

### 정렬 기능
- 4가지 정렬 기준: Price, 24h Change, 24h Volume, Market Cap
- 오름차순/내림차순 토글
- 시각적 정렬 표시 (파란색 인디케이터)

### 즐겨찾기
- 별 아이콘 클릭으로 즐겨찾기 추가/제거
- localStorage 기반 영구 저장
- 즐겨찾기 상태 토스트 알림

## 🤖 AI 활용 내역

- **사용 도구**: Claude Code (Anthropic)
- **활용 내용**:
  - 프로젝트 초기 구조 설계 및 파일 생성
  - TypeScript 타입 정의 및 유틸리티 함수 작성
  - React 컴포넌트 구현 및 최적화
  - Next.js API Route 구현
  - TanStack Query 설정 및 캐싱 전략
  - react-virtuoso 가상 스크롤링 구현
  - shadcn/ui 통합 및 커스터마이징
  - 반응형 레이아웃 구현 (모바일/데스크톱)
  - 다크 테마 색상 시스템 구현

## 💡 보완하고 싶은 점

### 1. **테스트 코드 작성**
- Jest, React Testing Library를 활용한 단위/통합 테스트
- E2E 테스트 (Playwright/Cypress)
- 컴포넌트 스냅샷 테스트

### 2. **에러 핸들링 개선**
- API 에러에 대한 더 구체적인 UI 피드백
- 재시도 로직 추가 (React Query retry)
- 네트워크 상태 감지 및 오프라인 모드

### 3. **접근성 (a11y) 개선**
- 키보드 네비게이션 강화
- 스크린 리더 지원 개선
- ARIA 레이블 보강
- 포커스 관리 개선

### 4. **추가 기능**
- 다국어 지원 (i18n)
- 코인 상세 페이지
- 가격 알림 기능
- 차트 뷰 추가
- 페이지네이션 옵션

### 5. **성능 최적화**
- 검색 입력 debounce 적용
- 이미지 최적화 (Next.js Image 컴포넌트)
- 코드 스플리팅 개선
- Service Worker를 통한 오프라인 지원

### 6. **UX 개선**
- 검색어 하이라이트 기능
- 로딩 스켈레톤 UI
- 애니메이션 효과 추가
- 더 나은 에러 상태 표시

## 📝 라이선스

ISC