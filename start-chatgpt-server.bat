@echo off
echo ========================================
echo WeSign MCP Server for ChatGPT
echo With Beautiful Visual Widgets
echo ========================================
echo.

:: Check if .env exists
if not exist .env (
    echo WARNING: No .env file found!
    echo Creating .env from example...
    echo WESIGN_API_URL=https://devtest.comda.co.il > .env
    echo WESIGN_EMAIL=your-email@example.com >> .env
    echo WESIGN_PASSWORD=your-password >> .env
    echo WESIGN_PERSISTENT=false >> .env
    echo.
    echo PLEASE EDIT .env file with your credentials!
    echo.
    pause
    exit /b 1
)

:: Load environment variables
echo Loading environment variables...
for /f "tokens=1,2 delims==" %%a in (.env) do (
    set %%a=%%b
)

echo.
echo Configuration:
echo   API URL: %WESIGN_API_URL%
echo   Email: %WESIGN_EMAIL%
echo.

:: Build if needed
if not exist dist\mcp-http-server.js (
    echo Building TypeScript...
    call npm run build
    if errorlevel 1 (
        echo Build failed!
        pause
        exit /b 1
    )
)

:: Start server
echo.
echo Starting WeSign MCP HTTP Server...
echo Visual widgets enabled!
echo.
node dist\mcp-http-server.js

pause
