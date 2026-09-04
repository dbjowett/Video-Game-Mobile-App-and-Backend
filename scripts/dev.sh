#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

RUN_DB=false
RUN_BACKEND=false
RUN_FRONTEND=false
RUN_MOBILE=false

for arg in "$@"; do
  case "$arg" in
    --) ;; # tolerate a literal `--` separator, in case pnpm forwards it
    -a|--all) RUN_DB=true; RUN_BACKEND=true; RUN_FRONTEND=true; RUN_MOBILE=true ;;
    -d|--db) RUN_DB=true ;;
    -b|--backend) RUN_BACKEND=true ;;
    -f|--frontend) RUN_FRONTEND=true ;;
    -m|--mobile) RUN_MOBILE=true ;;
    -h|--help)
      cat <<'EOF'
Usage: pnpm dev [-a|--all] [-d|--db] [-b|--backend] [-f|--frontend] [-m|--mobile]
  No flags = db + backend (frontend/mobile have their own interactive dev
  loops that are usually nicer to watch in their own terminal)
  Flags combine, e.g.: pnpm dev --backend --frontend
  --all / -a runs everything, including frontend and mobile
EOF
      exit 0
      ;;
    *)
      echo "Unknown flag: $arg (use -h for usage)" >&2
      exit 1
      ;;
  esac
done

if ! $RUN_DB && ! $RUN_BACKEND && ! $RUN_FRONTEND && ! $RUN_MOBILE; then
  RUN_DB=true; RUN_BACKEND=true
fi

if $RUN_DB; then
  echo "Starting Postgres (docker compose up -d db)..."
  docker compose up -d db
fi

if $RUN_BACKEND; then
  BACKEND_PORT=3000
  existing_pid="$(lsof -ti:"$BACKEND_PORT" 2>/dev/null || true)"
  if [ -n "$existing_pid" ]; then
    echo "Port $BACKEND_PORT already in use (pid $existing_pid) — killing it before starting backend..."
    kill -9 $existing_pid 2>/dev/null || true
  fi
fi

names=() colors=() cmds=()
if $RUN_BACKEND;  then names+=(backend);  colors+=(green);   cmds+=("pnpm --filter backend run start:dev"); fi
if $RUN_FRONTEND; then names+=(frontend); colors+=(cyan);    cmds+=("pnpm --filter frontend run dev"); fi
if $RUN_MOBILE;   then names+=(mobile);   colors+=(magenta); cmds+=("pnpm --filter mobile run start"); fi

if [ ${#cmds[@]} -eq 0 ]; then
  echo "Nothing else to start (docker db handled above if requested)."
  exit 0
fi

IFS=, ; names_csv="${names[*]}" ; colors_csv="${colors[*]}" ; unset IFS

exec pnpm exec concurrently --kill-others -n "$names_csv" -c "$colors_csv" "${cmds[@]}"
