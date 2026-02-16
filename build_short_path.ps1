
Write-Host "Detected Path Too Long Error. Attempting to build using a virtual drive (Z:)..."

$originalPath = Get-Location
$virtualDrive = "Z:"

# Check if Z: is already used
if (Test-Path $virtualDrive) {
    Write-Host "Drive Z: is already in use. Unsubst it first..."
    subst Z: /D
}

Write-Host "Mapping $originalPath to $virtualDrive..."
subst Z: "$originalPath"

if (-not (Test-Path $virtualDrive)) {
    Write-Host "Failed to map virtual drive. Please move your project to a folder with a shorter path (e.g. C:\proj)." -ForegroundColor Red
    exit 1
}

# Switch to the virtual drive
Set-Location $virtualDrive

Write-Host "Cleaning previous build artifacts..."
if (Test-Path "android\app\build") { Remove-Item "android\app\build" -Recurse -Force -ErrorAction SilentlyContinue }
if (Test-Path "android\.gradle") { Remove-Item "android\.gradle" -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host "Running Gradle Build from $virtualDrive..."
Set-Location android
./gradlew assembleRelease --no-daemon

if ($?) {
    Write-Host "Build Successful!" -ForegroundColor Green
    # Copy the APK back to the real path location so the user can find it easily
    $apkSource = "app\build\outputs\apk\release\app-release.apk"
    $apkDest = "$originalPath\android\app\build\outputs\apk\release\app-release.apk"
    
    if (Test-Path $apkSource) {
        Write-Host "Copying APK to original location..."
        New-Item -ItemType Directory -Force -Path "$originalPath\android\app\build\outputs\apk\release" | Out-Null
        Copy-Item -Path $apkSource -Destination $apkDest -Force
        Write-Host "APK available at: $apkDest" -ForegroundColor Cyan
    }
}
else {
    Write-Host "Build Failed on virtual drive as well." -ForegroundColor Red
}

# Cleanup
Set-Location C:
Write-Host "Unmapping virtual drive..."
subst Z: /D
