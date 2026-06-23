@echo off
REM Compila el sitio para produccion usando Ruby instalado en C:\Users\Zamch\Ruby.

cd /d "%~dp0\.."
set "PATH=C:\Users\Zamch\Ruby\bin;%PATH%"
set "JEKYLL_ENV=production"

bundle exec jekyll build %*
