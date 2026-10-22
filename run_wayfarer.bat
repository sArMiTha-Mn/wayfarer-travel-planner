@echo off
title Wayfarer Travel Planner
echo ========================================================
echo   Starting Wayfarer AI Travel Itinerary Planner...
echo ========================================================
echo.
cd /d "%~dp0"
echo Opening browser at http://localhost:5173 ...
start http://localhost:5173
echo.
echo Running server (Keep this window open while using the app)...
call npm.cmd run dev
pause
