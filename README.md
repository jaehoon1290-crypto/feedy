# FEEDY

광고와 이벤트를 걷어내고 주문에만 집중하는 배달 주문 플랫폼입니다. 현재는 Phase 1(인증, 가게, 메뉴, 장바구니, 주문, 즐겨찾기)의 실행 가능한 기반을 제공합니다.

## 실행

1. `cp apps/api/.env.example apps/api/.env` 후 `MONGODB_URI`, `JWT_SECRET`을 설정합니다.
2. `npm install`
3. `npm run seed` (선택: 예제 가게/메뉴 생성)
4. `npm run dev`

- 웹: `http://localhost:5173`
- 사장님 앱: `http://localhost:5174`
- API: `http://localhost:4000/api/v1`

## 구조

`apps/web`은 화면과 API 클라이언트를, `apps/api/src/modules`는 도메인별 REST 모듈을, `packages/contracts`는 프런트/백엔드 공용 계약을 관리합니다.

- `auth`, `users`, `stores`, `orders`, `favorites`: 고객 Phase 1
- `merchant`: 가게 생성·정보 수정·메뉴 등록·주문 상태 변경 (OWNER 권한)
- `admin`: 회원·주문 현황 조회 (ADMIN 권한)
- `PaymentProvider`, `MapProvider`, `NotificationProvider`: 외부 공급자를 교체할 수 있는 포트 인터페이스

MongoDB 컬렉션은 현재 `users`, `categories`, `stores`, `orders`, `favorites`를 사용합니다. Phase 2부터 `reviews`, `payments`, `coupons`, `notifications`를 독립 모듈/컬렉션으로 추가합니다.

## API 요약

- `POST /api/v1/auth/signup`, `POST /api/v1/auth/login`
- `GET /api/v1/categories`, `GET /api/v1/stores`, `GET /api/v1/stores/:id`
- `POST /api/v1/orders`, `GET /api/v1/orders`
- `GET|PUT|DELETE /api/v1/favorites[/:storeId]`
- `POST|PATCH /api/v1/merchant/stores...` (OWNER)
- `GET /api/v1/admin/dashboard` (ADMIN)
