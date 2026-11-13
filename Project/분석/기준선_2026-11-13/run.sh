#!/usr/bin/env bash
# 사용법: run.sh <이름> <k6 스크립트> [k6 -e 인자...]
set -u
NAME=$1; SCRIPT=$2; shift 2
S="$(cd "$(dirname "$0")" && pwd)"
OUT="$S/results"; mkdir -p "$OUT"
q() { docker exec pawcycle-baseline-mysql-1 sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -uroot -N -e "SHOW GLOBAL STATUS WHERE Variable_name IN (\"Com_select\",\"Com_insert\",\"Com_update\",\"Questions\")"' 2>/dev/null | awk '{printf "%s=%s ",$1,$2}'; }
BEFORE=$(q)
( sleep 60; docker stats --no-stream --format '{{.Name}} cpu={{.CPUPerc}} mem={{.MemUsage}}' | grep baseline > "$OUT/$NAME.stats.txt" ) &
k6 run --quiet "$@" -e RESULT="$(cygpath -w "$OUT/$NAME.json")" "$(cygpath -w "$S/k6/$SCRIPT")" > "$OUT/$NAME.k6.txt" 2>&1
wait
AFTER=$(q)
THREADS=$(docker exec pawcycle-baseline-backend-1 sh -c 'ls /proc/1/task | wc -l' 2>/dev/null)
RESTARTS=$(docker inspect -f '{{.RestartCount}} oom={{.State.OOMKilled}}' pawcycle-baseline-backend-1)
echo "before: $BEFORE" > "$OUT/$NAME.db.txt"; echo "after:  $AFTER" >> "$OUT/$NAME.db.txt"
echo "threads_after=$THREADS restarts=$RESTARTS" >> "$OUT/$NAME.db.txt"
cat "$OUT/$NAME.json"; cat "$OUT/$NAME.db.txt"; cat "$OUT/$NAME.stats.txt" 2>/dev/null
