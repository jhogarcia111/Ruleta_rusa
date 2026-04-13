@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
echo ========================================
echo 🔄 Reiniciando Servidores de Ruleta Rusa
echo ========================================
echo.

:: Configuración de puertos
set BACKEND_PORT=3031
set FRONTEND_PORT=4031

:: Rutas del proyecto
set BACKEND_DIR=
set FRONTEND_DIR=

echo 📍 Puertos configurados:
echo    Backend:  %BACKEND_PORT%
echo    Frontend: %FRONTEND_PORT%
echo.

:: Cerrar procesos del backend
echo.
echo ========================================
echo 🔧 Backend (Puerto %BACKEND_PORT%)
echo ========================================
call :kill_port %BACKEND_PORT%

:: Esperar un momento para que los puertos se liberen
timeout /t 2 /nobreak >nul

:: Verificar que los directorios existen
echo.
echo ========================================
echo 🚀 Iniciando Servidores
echo ========================================
echo.

:: Iniciar Backend en Windows Terminal
echo 📡 Iniciando Backend...
wt.exe new-tab --title "Ruleta Rusa - Backend" --startingDirectory "%CD%" cmd /k "chcp 65001 >nul && title "Ruleta Rusa - Backend" && set TZ=America/Bogota && set PORT=%BACKEND_PORT% && echo. && echo ======================================== && echo 🔧 Backend - Puerto %BACKEND_PORT% && echo ======================================== && echo. && set PORT=%BACKEND_PORT% && call npm.cmd run dev"

echo.
echo ========================================
echo ✅ Servidores Reiniciados
echo ========================================
echo.
echo 📊 Backend:  http://localhost:%BACKEND_PORT%
echo.
echo 💡 Dos ventanas se abrirán con los servidores corriendo
echo 💡 Cierra esta ventana cuando quieras detener los servidores
echo.
pause
goto :end

:: Función para encontrar y cerrar proceso en un puerto (sin bucles infinitos)
:kill_port
setlocal enabledelayedexpansion
set PORT=%1
set FOUND=0
echo 🔍 Buscando procesos en puerto %PORT%...

:: Verificar primero si hay procesos
netstat -ano 2>nul | findstr /C:":%PORT%" | findstr "LISTENING" >nul 2>&1
if errorlevel 1 (
    echo ✅ No hay procesos en puerto %PORT%
    endlocal
    exit /b 0
)

:: Buscar procesos usando el puerto - solo procesar el primero y salir
:: Usar método simple: obtener solo la primera línea
set TMP_OUT=%TEMP%\port_%PORT%_%RANDOM%.txt
netstat -ano 2>nul | findstr /C:":%PORT%" | findstr "LISTENING" > "%TMP_OUT%" 2>nul

if exist "%TMP_OUT%" (
    set /p FIRST_LINE=<"%TMP_OUT%" 2>nul
    if defined FIRST_LINE (
        REM Extraer PID (último campo)
        for %%p in (%FIRST_LINE%) do set PID=%%p
        if defined PID (
            if not "!PID!"=="" if not "!PID!"=="0" (
                set FOUND=1
                echo ⚠️  Proceso encontrado: PID !PID!
                echo 🛑 Cerrando proceso...
                taskkill /PID !PID! /F >nul 2>&1
                if !errorlevel! equ 0 (
                    echo ✅ Proceso cerrado exitosamente
                ) else (
                    echo ⚠️  No se pudo cerrar el proceso (puede que ya no exista)
                )
            )
        )
    )
    del "%TMP_OUT%" >nul 2>&1
)

if !FOUND! equ 0 (
    echo ✅ No hay procesos en puerto %PORT%
)
endlocal
exit /b 0

:end
