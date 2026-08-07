#!/usr/bin/env bash
#
# 이음 - 시연/테스트용 고정 계정 시드 스크립트
#
# 백엔드가 H2 인메모리(jdbc:h2:mem)라서 재기동하면 계정·환자코드·삶의DB가 전부 사라집니다.
# 백엔드를 새로 띄운 뒤 이 스크립트를 한 번 실행하면 아래 상태까지 만들어 둡니다.
#
#   - 환자 계정  (역할 patient, 환자 기본정보 등록까지 완료 → 6자리 코드 발급)
#   - 보호자 계정 (역할 guardian, 위 환자와 코드 연동 완료)
#   - 삶의 DB 샘플 3건 (그중 1건은 사진 포함)
#
# 백엔드 코드는 건드리지 않고 공개 API 호출만 사용합니다.
#
# 사용법:
#   bash scripts/seed-demo.sh                     # 기본 http://localhost:8080
#   API_BASE=http://localhost:9090/api bash scripts/seed-demo.sh
#
# 요구사항: curl (Git Bash / WSL / macOS / Linux 어디서든 동작)

set -uo pipefail

API_BASE="${API_BASE:-http://localhost:8080/api}"

# ── 고정 테스트 계정 (팀 공유용, 명백한 테스트 값) ───────────────────
# 아이디는 백엔드 정책상 영문·숫자 4~20자만 됩니다(_ - 등 기호 불가).
PATIENT_ID="demopatient"
PATIENT_PW="test1234"
PATIENT_NAME="김이음"
PATIENT_BIRTH="1950-03-15"

GUARDIAN_ID="demoguardian"
GUARDIAN_PW="test1234"
GUARDIAN_NAME="박보호"
GUARDIAN_BIRTH="1980-07-20"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; BOLD=$'\033[1m'; OFF=$'\033[0m'

info()  { printf '%s\n' "$*"; }
ok()    { printf '%s✔%s %s\n' "$GREEN" "$OFF" "$*"; }
warn()  { printf '%s!%s %s\n' "$YELLOW" "$OFF" "$*"; }
die()   { printf '%s✘ %s%s\n' "$RED" "$*" "$OFF" >&2; exit 1; }

# JSON 문자열 필드 추출 (jq 없이 동작하도록 최소 구현)
jstr() { grep -o "\"$2\":\"[^\"]*\"" <<<"$1" | head -1 | sed "s/\"$2\":\"//;s/\"$//"; }
jnum() { grep -o "\"$2\":[0-9]*" <<<"$1" | head -1 | grep -o '[0-9]*$'; }

# POST/PUT/GET 공통. 한글이 깨지지 않도록 body는 항상 파일로 넘깁니다.
req() { # req METHOD PATH [BODY_JSON] [TOKEN] -> "HTTPCODE\nBODY"
  local method="$1" path="$2" body="${3:-}" token="${4:-}"
  local args=(-s -w $'\n%{http_code}' -X "$method" "${API_BASE}${path}")
  if [ -n "$body" ]; then
    printf '%s' "$body" > "$TMP/body.json"
    args+=(-H 'Content-Type: application/json; charset=utf-8' --data-binary @"$TMP/body.json")
  fi
  [ -n "$token" ] && args+=(-H "Authorization: Bearer $token")
  curl "${args[@]}"
}

split_code() { tail -n1 <<<"$1"; }
split_body() { sed '$d' <<<"$1"; }

# 계정 하나를 "가입 → 역할설정 → 재로그인"까지 끝내고 토큰을 돌려줍니다.
# 이미 있는 계정이면 로그인만 합니다(스크립트를 여러 번 돌려도 안전).
setup_account() { # setup_account ID PW NAME BIRTH ROLE -> 토큰을 stdout으로
  local id="$1" pw="$2" name="$3" birth="$4" role="$5" r code

  r=$(req POST /auth/register "{\"user_id\":\"$id\",\"user_pw\":\"$pw\",\"name\":\"$name\",\"birth_date\":\"$birth\"}")
  code=$(split_code "$r")
  if [ "$code" = "201" ]; then
    printf '  가입 완료: %s\n' "$id" >&2
  elif [ "$code" = "409" ]; then
    printf '  이미 존재하는 계정: %s (로그인만 진행)\n' "$id" >&2
  else
    printf '  회원가입 실패(HTTP %s): %s\n' "$code" "$(split_body "$r")" >&2
    return 1
  fi

  r=$(req POST /auth/login "{\"user_id\":\"$id\",\"user_pw\":\"$pw\"}")
  [ "$(split_code "$r")" = "200" ] || { printf '  로그인 실패: %s\n' "$(split_body "$r")" >&2; return 1; }
  local token; token=$(jstr "$(split_body "$r")" token)

  # 역할이 아직 없으면 설정 후, role 클레임이 담긴 새 토큰을 받기 위해 다시 로그인
  if [ -z "$(jstr "$(split_body "$r")" role)" ]; then
    r=$(req PATCH /auth/role "{\"role\":\"$role\"}" "$token")
    [ "$(split_code "$r")" = "200" ] || { printf '  역할 설정 실패: %s\n' "$(split_body "$r")" >&2; return 1; }
    r=$(req POST /auth/login "{\"user_id\":\"$id\",\"user_pw\":\"$pw\"}")
    token=$(jstr "$(split_body "$r")" token)
  fi

  printf '%s' "$token"
}

# ── 0. 백엔드 확인 ────────────────────────────────────────────────
info "${BOLD}이음 시연용 데이터 시드${OFF}  (API: $API_BASE)"
info ""
curl -s -o /dev/null --max-time 5 "${API_BASE}/auth/check-id?user_id=ping" \
  || die "백엔드에 연결할 수 없습니다: $API_BASE  (bootRun 이 떠 있는지 확인하세요)"

# ── 1. 환자 계정 ──────────────────────────────────────────────────
info "${BOLD}[1/5]${OFF} 환자 계정"
PATIENT_TOKEN=$(setup_account "$PATIENT_ID" "$PATIENT_PW" "$PATIENT_NAME" "$PATIENT_BIRTH" patient) \
  || die "환자 계정 준비 실패"
ok "환자 로그인 완료"

# ── 2. 환자 기본정보 등록 (여기서 6자리 코드가 발급됩니다) ─────────────
info "${BOLD}[2/5]${OFF} 환자 기본정보 등록 (S05)"
RES=$(req POST /patient/register \
  '{"diagnosis":"경도인지장애","gender":"남성","cognitive_support_level":"보통","guardian_companion":true}' \
  "$PATIENT_TOKEN")
CODE=$(split_code "$RES"); BODY=$(split_body "$RES")

if [ "$CODE" = "201" ]; then
  P_CODE=$(jstr "$BODY" p_code)
  INTERNAL=$(jnum "$BODY" internal_code)
  ok "환자 등록 완료"
elif [ "$CODE" = "409" ]; then
  warn "이미 등록된 환자입니다. 기존 정보를 조회합니다."
  RES=$(req GET /patient/me "" "$PATIENT_TOKEN"); BODY=$(split_body "$RES")
  P_CODE=$(jstr "$BODY" p_code)
  INTERNAL=$(jnum "$BODY" internal_code)
else
  die "환자 등록 실패(HTTP $CODE): $BODY"
fi
[ -n "${P_CODE:-}" ] || die "6자리 환자 코드를 얻지 못했습니다: $BODY"
ok "6자리 코드: $P_CODE  (내부 코드: $INTERNAL)"

# ── 3. 보호자 계정 + 코드 연동 ────────────────────────────────────
info "${BOLD}[3/5]${OFF} 보호자 계정 + 코드 연동 (S08)"
GUARDIAN_TOKEN=$(setup_account "$GUARDIAN_ID" "$GUARDIAN_PW" "$GUARDIAN_NAME" "$GUARDIAN_BIRTH" guardian) \
  || die "보호자 계정 준비 실패"

RES=$(req POST /guardian/link "{\"p_code\":\"$P_CODE\"}" "$GUARDIAN_TOKEN")
CODE=$(split_code "$RES")
case "$CODE" in
  200) ok "연동 완료" ;;
  409) warn "이미 연동되어 있습니다 (정상)" ;;
  *)   die "연동 실패(HTTP $CODE): $(split_body "$RES")" ;;
esac

# ── 4. 사진 1장 업로드 (R2 미설정이면 건너뜁니다) ──────────────────
info "${BOLD}[4/5]${OFF} 샘플 사진 업로드"
PHOTO_URL=""
# 1x1 PNG (외부 파일 의존 없이 스크립트 안에서 생성)
printf '%s' 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=' \
  | base64 -d > "$TMP/sample.png" 2>/dev/null

if [ -s "$TMP/sample.png" ]; then
  RES=$(curl -s -w $'\n%{http_code}' --max-time 30 -X POST "${API_BASE}/patients/${INTERNAL}/images" \
        -H "Authorization: Bearer $GUARDIAN_TOKEN" -F "image=@$TMP/sample.png")
  if [ "$(split_code "$RES")" = "201" ]; then
    PHOTO_URL=$(jstr "$(split_body "$RES")" photo_url)
    ok "업로드 완료: $PHOTO_URL"
  else
    warn "사진 업로드 실패 — R2 환경변수(R2_*)가 설정되지 않았을 수 있습니다. 사진 없이 계속합니다."
  fi
else
  warn "base64 명령을 쓸 수 없어 사진 업로드를 건너뜁니다."
fi

# ── 5. 삶의 DB 샘플 3건 ───────────────────────────────────────────
info "${BOLD}[5/5]${OFF} 삶의 DB 샘플 데이터"

# (1) 가족 정보 — 사진이 있으면 함께 저장.
#     백엔드는 event 가 비어 있으면 photo_url 을 버리므로 event 도 같이 채웁니다.
if [ -n "$PHOTO_URL" ]; then
  MEM1="{\"title\":\"가족 정보\",\"category\":\"가족 사진\",\"family\":\"김순자(78세, 아내), 김철수(52세, 아들), 김영희(49세, 딸)\",\"hometown\":\"전라남도 목포\",\"job\":\"중학교 교사\",\"photo_url\":\"$PHOTO_URL\",\"event\":\"가족 사진 등록\"}"
else
  MEM1='{"title":"가족 정보","category":"가족","family":"김순자(78세, 아내), 김철수(52세, 아들), 김영희(49세, 딸)","hometown":"전라남도 목포","job":"중학교 교사"}'
fi
RES=$(req POST "/patients/${INTERNAL}/memories" "$MEM1" "$GUARDIAN_TOKEN")
[ "$(split_code "$RES")" = "201" ] && ok "삶의DB 1 - 가족 정보" || warn "삶의DB 1 실패: $(split_body "$RES")"
MEMORY_ID=$(jnum "$(split_body "$RES")" memory_id)

RES=$(req POST "/patients/${INTERNAL}/memories" \
  '{"title":"좋아하는 것","category":"취향","like":"트로트, 팥칼국수, 산책","place":"목포 유달산, 동네 경로당"}' \
  "$GUARDIAN_TOKEN")
[ "$(split_code "$RES")" = "201" ] && ok "삶의DB 2 - 좋아하는 것" || warn "삶의DB 2 실패: $(split_body "$RES")"

RES=$(req POST "/patients/${INTERNAL}/memories" \
  '{"title":"직업과 고향","category":"생애","job":"중학교 국어 교사로 35년 근무","hometown":"전라남도 목포","place":"목포 시내 중학교"}' \
  "$GUARDIAN_TOKEN")
[ "$(split_code "$RES")" = "201" ] && ok "삶의DB 3 - 직업과 고향" || warn "삶의DB 3 실패: $(split_body "$RES")"

# ── 결과 요약 ─────────────────────────────────────────────────────
cat <<SUMMARY

${BOLD}────────────────────────────────────────────${OFF}
${BOLD}  시드 완료${OFF}
${BOLD}────────────────────────────────────────────${OFF}

  환자    아이디: ${BOLD}${PATIENT_ID}${OFF}   비밀번호: ${BOLD}${PATIENT_PW}${OFF}
  보호자  아이디: ${BOLD}${GUARDIAN_ID}${OFF}  비밀번호: ${BOLD}${GUARDIAN_PW}${OFF}

  6자리 환자 코드 (S08 연동 입력용): ${BOLD}${GREEN}${P_CODE}${OFF}
  내부 코드 (API 경로용)           : ${INTERNAL}
  삶의 DB memory_id                : ${MEMORY_ID:-N/A}

  프론트: http://localhost:5173

  ※ 백엔드는 H2 인메모리라 재기동하면 위 데이터가 모두 사라집니다.
     재기동할 때마다 이 스크립트를 다시 실행하세요.
     (코드는 매번 새로 발급되므로 값이 달라집니다)

SUMMARY
