@echo off
setlocal

:: --- KONFIGURASI ---
:: Port yang digunakan Live Server
set PORT=5510

:: Mendapatkan IP WSL (eth0) secara otomatis
for /f "tokens=1" %%i in ('wsl hostname -I') do set WSL_IP=%%i

echo ===========================================
echo    WSL2 WLAN ACCESS HELPER
echo ===========================================
echo IP WSL Terdeteksi: %WSL_IP%
echo Port Target: %PORT%
echo.

:: 1. Menghapus konfigurasi proxy lama (agar tidak bentrok)
echo [1/3] Membersihkan konfigurasi lama...
netsh interface portproxy delete v4tov4 listenport=%PORT% listenaddress=0.0.0.0 >nul 2>&1

:: 2. Membuat Port Proxy baru dari Windows ke WSL
echo [2/3] Mengatur Port Forwarding...
netsh interface portproxy add v4tov4 listenport=%PORT% listenaddress=0.0.0.0 connectport=%PORT% connectaddress=%WSL_IP%

:: 3. Membuka Firewall Windows
echo [3/3] Membuka Firewall Port %PORT%...
powershell -Command "if (!(Get-NetFirewallRule -DisplayName 'WSL_Live_Server_Access' -ErrorAction SilentlyContinue)) { New-NetFirewallRule -DisplayName 'WSL_Live_Server_Access' -Direction Inbound -Action Allow -Protocol TCP -LocalPort %PORT% } else { Set-NetFirewallRule -DisplayName 'WSL_Live_Server_Access' -LocalPort %PORT% }"

echo.
echo ===========================================
echo BERHASIL! 
echo Silakan akses dari perangkat lain menggunakan:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr "192.168.100."') do (
    echo http:%%a:%PORT%
)
echo ===========================================
pause