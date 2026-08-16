#!/usr/bin/env bash
set -euo pipefail

REPO_DIR=/opt/freonn
BRANCH=main
LOG=/var/log/freonn-deploy.log
LOCK=/run/lock/freonn-deploy.lock
export HOME=/root
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

exec 9>"$LOCK"
flock -n 9 || exit 0
cd "$REPO_DIR"
git fetch --quiet --depth=1 origin "$BRANCH"
REMOTE=$(git rev-parse "origin/$BRANCH")
LOCAL=$(git rev-parse HEAD)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if ! git cat-file -e "origin/$BRANCH:server/localStorage.ts" 2>/dev/null; then
    exit 0
fi

if [ "$CURRENT_BRANCH" = "$BRANCH" ] && [ "$LOCAL" = "$REMOTE" ]; then
    exit 0
fi

echo "[$(date -Is)] deploying $BRANCH $LOCAL ($CURRENT_BRANCH) -> $REMOTE" >> "$LOG"
git checkout -q "$BRANCH" 2>>"$LOG" || git checkout -qB "$BRANCH" "origin/$BRANCH" >>"$LOG" 2>&1
git reset --hard "origin/$BRANCH" >>"$LOG" 2>&1

if ! git diff --quiet "$LOCAL" "$REMOTE" -- pnpm-lock.yaml 2>/dev/null; then
    echo "[$(date -Is)] pnpm-lock.yaml changed -> pnpm install" >> "$LOG"
    pnpm install --frozen-lockfile >>"$LOG" 2>&1
fi

pnpm build >>"$LOG" 2>&1
systemctl restart freonn.service
echo "[$(date -Is)] deployed $REMOTE OK" >> "$LOG"
