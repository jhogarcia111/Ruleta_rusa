cd\
cd "C:\Users\Jho\Documents\GitHub\Ruleta Rusa"

@echo off
echo ========================================
echo    Ruleta Rusa - Server Restart
echo ========================================
echo.

echo [1/5] Identificando procesos en puertos específicos...

REM Función para obtener PID del proceso que usa un puerto específico
set "PORT_3031_PID="
set "PORT_4031_PID="

REM Buscar proceso en puerto 3031 (Backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3031" ^| findstr "LISTENING"') do (
    set "PORT_3031_PID=%%a"
)

REM Buscar proceso en puerto 4031 (Frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4031" ^| findstr "LISTENING"') do (
    set "PORT_4031_PID=%%a"
)

echo.
echo [2/5] Deteniendo procesos específicos en puertos del proyecto...

REM Detener proceso en puerto 3031 si existe
if not "%PORT_3031_PID%"=="" (
    echo ⚠ Proceso encontrado en puerto 3031 (PID: %PORT_3031_PID%)
    taskkill /F /PID %PORT_3031_PID% >nul 2>&1
    if %errorlevel% == 0 (
        echo ✓ Proceso en puerto 3031 detenido exitosamente
    ) else (
        echo ⚠ No se pudo detener el proceso en puerto 3031
    )
) else (
    echo ℹ No hay proceso ejecutándose en puerto 3031
)

REM Detener proceso en puerto 4031 si existe
if not "%PORT_4031_PID%"=="" (
    echo ⚠ Proceso encontrado en puerto 4031 (PID: %PORT_4031_PID%)
    taskkill /F /PID %PORT_4031_PID% >nul 2>&1
    if %errorlevel% == 0 (
        echo ✓ Proceso en puerto 4031 detenido exitosamente
    ) else (
        echo ⚠ No se pudo detener el proceso en puerto 4031
    )
) else (
    echo ℹ No hay proceso ejecutándose en puerto 4031
)
echo.

echo [3/5] Esperando 2 segundos para liberar puertos...
timeout /t 2 /nobreak >nul
echo.

echo [4/5] Verificando que los puertos estén libres...
netstat -an | findstr ":3031" >nul
if %errorlevel% == 0 (
    echo ⚠ Puerto 3031 aún en uso, esperando...
    timeout /t 3 /nobreak >nul
) else (
    echo ✓ Puerto 3031 libre
)

netstat -an | findstr ":4031" >nul
if %errorlevel% == 0 (
    echo ⚠ Puerto 4031 aún en uso, esperando...
    timeout /t 3 /nobreak >nul
) else (
    echo ✓ Puerto 4031 libre
)
echo.

echo [5/5] Iniciando servidores del proyecto...

echo Iniciando servidores en Windows Terminal con paneles divididos...

REM Crear script temporal para backend
echo @echo off > "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\temp_backend_Ruleta_Rusa.bat"
echo cd /d "C:\Users\Jho\Documents\GitHub\Ruleta Rusa" >> "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\temp_backend_Ruleta_Rusa.bat"

echo npm run dev >> "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\temp_backend_Ruleta_Rusa.bat"
echo pause >> "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\temp_backend_Ruleta_Rusa.bat"

REM Crear script temporal para frontend
echo @echo off > "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\temp_frontend_Ruleta_Rusa.bat"
echo cd /d "C:\Users\Jho\Documents\GitHub\Ruleta Rusa" >> "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\temp_frontend_Ruleta_Rusa.bat"
echo cd frontend-react >> "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\\temp_frontend_Ruleta_Rusa.bat"
echo echo Esperando 3 segundos para que el backend esté listo... >> "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\temp_frontend_Ruleta_Rusa.bat"
echo timeout /t 3 /nobreak ^>nul >> "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\temp_frontend_Ruleta_Rusa.bat"
echo npm run dev >> "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\temp_frontend_Ruleta_Rusa.bat"
echo pause >> "C:\Users\Jho\Documents\GitHub\Ruleta Rusa\temp_frontend_Ruleta_Rusa.bat"

REM Ejecutar en Windows Terminal
start wt new-tab --title "Backend - Ruleta Rusa" cmd /k "cd /d \"C:\Users\Jho\Documents\GitHub\Ruleta Rusa\" && temp_backend_Ruleta_Rusa.bat" ; split-pane --title "Frontend - Ruleta Rusa" cmd /k "cd /d \"C:\Users\Jho\Documents\GitHub\Ruleta Rusa\" && temp_frontend_Ruleta_Rusa.bat"
echo ✓ Backend iniciado en puerto 3031
echo ✓ Frontend iniciado en puerto 4031
echo.

echo ========================================
echo    ¡Servidores iniciados exitosamente!
echo ========================================
echo.
echo Proyecto: Ruleta Rusa
echo Backend:  http://localhost:3031
echo Frontend: http://localhost:4031
echo.
echo ========================================
echo    Información de Seguridad
echo ========================================
echo.
echo ✓ Solo se detienen procesos en puertos 3031 y 4031
echo ✓ Otros procesos de Node.js en el sistema NO se afectan
echo ✓ Identificación específica por PID antes de detener
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul