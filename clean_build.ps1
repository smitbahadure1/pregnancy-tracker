Write-Host "Step 1: Killing Java processes to release file locks (OneDrive/Gradle)..."
Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "openjdk" -Force -ErrorAction SilentlyContinue

# Wait a moment for processes to release locks
Start-Sleep -Seconds 2

Write-Host "Step 2: Cleaning Android Build Directories..."
$buildDirs = @(
    "android\build",
    "android\app\build",
    "android\.gradle"
)

foreach ($dir in $buildDirs) {
    if (Test-Path $dir) {
        Write-Host "Removing $dir..."
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Step 3: Running Gradle Clean..."
Set-Location android
# Run clean with --no-daemon to avoid spawning a persistent process that might lock files
./gradlew clean --no-daemon

if ($?) {
    Write-Host "Clean successful."
}
else {
    Write-Host "Clean failed. Please check errors above." -ForegroundColor Red
    exit 1
}

Write-Host "Step 4: Building Release APK..."
# Adjust the task if you need a bundle instead (bundleRelease)
./gradlew assembleRelease --no-daemon

if ($?) {
    Write-Host "Build Successful!" -ForegroundColor Green
    Write-Host "APK should be in: android\app\build\outputs\apk\release\"
}
else {
    Write-Host "Build Failed." -ForegroundColor Red
}

Set-Location ..
