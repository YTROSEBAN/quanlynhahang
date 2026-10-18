@echo off
title Khoi dong Phan Mem Nha Hang KAGE (React + MySQL)
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================================
echo   KAGE RESTAURANT APP (REACT 19 + NODE.JS + MYSQL)
echo ========================================================
echo [1/2] Dang khoi chay Node.js API ket noi MySQL Database...
start "KAGE Node API" cmd /c "cd frontend && node server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Dang khoi dong React Frontend tren trinh duyet...
cd frontend
start http://localhost:5173/
npm run dev
