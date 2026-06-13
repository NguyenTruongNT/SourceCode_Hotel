@echo off
setlocal enabledelayedexpansion

set "OUTPUT=source_code.txt"
if exist "%OUTPUT%" del "%OUTPUT%"

echo Dang quet va tong hop source code vao %OUTPUT%...
echo Vui long doi trong giay lat...

:: Tim cac file co duoi .ts, .tsx, .js, .jsx, .css, .json (ban co the them cac duoi khac)
for /R %%f in (*.ts *.tsx *.js *.jsx *.css *.json) do (
    set "FILEPATH=%%f"
    
    :: Loai tru cac thu muc khong can thiet (node_modules, .next, .git)
    echo !FILEPATH! | findstr /i "\\node_modules\\" >nul
    if errorlevel 1 (
        echo !FILEPATH! | findstr /i "\\.next\\" >nul
        if errorlevel 1 (
            echo !FILEPATH! | findstr /i "\\.git\\" >nul
            if errorlevel 1 (
                :: Them ten file va noi dung vao file txt
                echo ================================================================================ >> "%OUTPUT%"
                echo File: %%f >> "%OUTPUT%"
                echo ================================================================================ >> "%OUTPUT%"
                type "%%f" >> "%OUTPUT%"
                echo. >> "%OUTPUT%"
                echo. >> "%OUTPUT%"
            )
        )
    )
)

echo ==========================================================
echo HOAN THANH! Toan bo source code da duoc luu vao file:
echo %CD%\%OUTPUT%
echo ==========================================================
pause
