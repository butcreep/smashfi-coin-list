# SmashFi Coin List

Next.js 16과 React 19로 구현한 암호화폐 시세판 과제 프로젝트입니다. CoinGecko 공개 API를 활용해 데이터를 가져오고, 즐겨찾기·검색·정렬·토스트·가상 스크롤 등 요구된 기능을 모두 담았습니다.

## 사용 기술 스택
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **스타일링**: Tailwind CSS, 커스텀 CSS 변수, 글래스모픽 테마
- **데이터/상태**: TanStack React Query, localStorage 연동 `useFavorites`
- **대용량 리스트**: `react-virtuoso` 기반 가상 스크롤
- **기타 도구**: lucide-react, tailwindcss-animate, ESLint, TypeScript

## 실행 방법
1. 의존성 설치: `npm install`
2. 개발 서버 실행: `npm run dev`
3. 브라우저에서 `http://localhost:3000` 접속 → 루트(`/`)가 자동으로 `/coin-list`로 리다이렉트됩니다.

> 별도의 환경 변수는 필요 없습니다. CoinGecko 공개 API를 그대로 호출합니다.

## 요구사항 체크리스트
- [x] **라우팅**: `/` → `/coin-list` 리다이렉트 (`src/app/page.tsx`)
- [x] **데이터 소스**: `/api/coins`가 CoinGecko `coins/markets` 호출, 실패 시 `src/lib/mocks/coins.ts` 폴백
- [x] **초기 정렬**: Price 내림차순
- [x] **탭**: All / My favorite + 즐겨찾기 상태(localStorage) 유지
- [x] **검색 인풋**: 심볼·이름을 대소문자 구분 없이 필터링
- [x] **표시 필드**: 심볼, 이름, Price, 24h Change, 24h Volume, Market Cap
- [x] **정렬 토글**: Price·24h Change·24h Volume·Market Cap 헤더 클릭 시 오름/내림차순 전환
- [x] **즐겨찾기 + 토스트**: `Successfully added! / Successfully deleted!` 토스트, 새로고침 후에도 상태 유지
- [x] **대용량 최적화**: `react-virtuoso`로 가상 스크롤 처리해 10,000+ 행도 부드럽게 스크롤

## 구현 핵심
- **Route Handler + ISR**: `revalidate: 5`로 서버 캐시를 5초마다 갱신하고 React Query `refetchInterval: 5000`과 맞춰 거의 실시간으로 반영
- **React Query 상태 관리**: `staleTime`/`refetchInterval` 설정으로 불필요한 리렌더를 줄이고 로딩/에러 상태를 일관되게 표시
- **`useFavorites` 훅**: Set + localStorage 동기화로 즐겨찾기 토글, 탭 필터, 토스트 메시지를 하나의 진실 소스로 유지
- **디자인 구현**: 글래스모픽 배경, 정렬 도트 인디케이터, 상단 토스트, 검색 입력/탭 등 시안을 그대로 반영
- **가상 스크롤**: Virtuoso가 화면에 필요한 행만 렌더링해 대용량 데이터에서도 성능 유지

## 보완하고 싶은 점
1. **실시간 스트리밍**: 5초 폴링 대신 거래소 WebSocket/SSE를 붙여 틱 단위 갱신을 지원하고 싶습니다.
2. **자동화 테스트**: Jest + React Testing Library, Playwright 기반 테스트를 추가해 회귀를 방지할 예정입니다.
3. **접근성·국제화**: 스크린리더 라벨 점검과 통화/숫자 로케일 옵션을 제공하고 싶습니다.
4. **모니터링**: Sentry 등 에러 수집 도구를 붙여 API 실패를 추적하면 운영 안정성이 올라갑니다.

## AI 활용 내역
- OpenAI ChatGPT (Codex CLI)를 통해 레이아웃 아이디어와 리팩터링 방향을 브레인스토밍하고 README 카피를 다듬었습니다. 모든 코드는 직접 검토 후 반영했습니다.
