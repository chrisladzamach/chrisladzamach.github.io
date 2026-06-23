#!/usr/bin/env bash
# Servidor de desarrollo Jekyll usando Ruby instalado en C:/Users/Zamch/Ruby.
# Uso: ./bin/serve.sh [--livereload]

set -e

cd "$(dirname "$0")/.."
export PATH="/c/Users/Zamch/Ruby/bin:$PATH"

bundle exec jekyll serve --host 127.0.0.1 --port 4000 "$@"
