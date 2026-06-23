#!/usr/bin/env bash
# Compila el sitio para produccion usando Ruby instalado en C:/Users/Zamch/Ruby.

set -e

cd "$(dirname "$0")/.."
export PATH="/c/Users/Zamch/Ruby/bin:$PATH"
export JEKYLL_ENV=production

bundle exec jekyll build "$@"
