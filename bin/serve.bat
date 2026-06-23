@echo off
REM Servidor de desarrollo Jekyll usando Ruby instalado en C:\Users\Zamch\Ruby.
REM Uso: .\bin\serve.bat

cd /d "%~dp0\.."
set "PATH=C:\Users\Zamch\Ruby\bin;%PATH%"

bundle exec jekyll serve --host 127.0.0.1 --port 4000 %*
