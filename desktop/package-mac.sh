#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RELEASE_DIR="$ROOT_DIR/electron-release"
APP_NAME="Lera"
APP_DIR="$RELEASE_DIR/${APP_NAME}-mac"
APP_BUNDLE="$APP_DIR/${APP_NAME}.app"
APP_CONTENTS="$APP_BUNDLE/Contents"
APP_RESOURCES="$APP_CONTENTS/Resources"
APP_RUNTIME="$APP_RESOURCES/app"
ICON_SOURCE="$ROOT_DIR/Lera.jpg"
ICON_PNG="$RELEASE_DIR/${APP_NAME}-icon.png"
ICONSET_DIR="$RELEASE_DIR/${APP_NAME}.iconset"
ICON_FILE="$APP_RESOURCES/${APP_NAME}.icns"

mkdir -p "$RELEASE_DIR"
rm -rf "$APP_DIR"
mkdir -p "$APP_DIR"

cp -R "$ROOT_DIR/node_modules/electron/dist/Electron.app" "$APP_BUNDLE"

mv "$APP_CONTENTS/MacOS/Electron" "$APP_CONTENTS/MacOS/$APP_NAME"
plutil -replace CFBundleDisplayName -string "$APP_NAME" "$APP_CONTENTS/Info.plist"
plutil -replace CFBundleName -string "$APP_NAME" "$APP_CONTENTS/Info.plist"
plutil -replace CFBundleExecutable -string "$APP_NAME" "$APP_CONTENTS/Info.plist"
plutil -replace CFBundleIdentifier -string "com.lera.desktop" "$APP_CONTENTS/Info.plist"

if [[ -f "$ICON_SOURCE" ]]; then
  rm -f "$ICON_PNG"
  rm -rf "$ICONSET_DIR"
  mkdir -p "$ICONSET_DIR"

  sips -s format png "$ICON_SOURCE" --out "$ICON_PNG" >/dev/null
  sips --padToHeightWidth 1024 1024 --padColor FFFFFF "$ICON_PNG" --out "$ICON_PNG" >/dev/null

  sips -z 16 16 "$ICON_PNG" --out "$ICONSET_DIR/icon_16x16.png" >/dev/null
  sips -z 32 32 "$ICON_PNG" --out "$ICONSET_DIR/icon_16x16@2x.png" >/dev/null
  sips -z 32 32 "$ICON_PNG" --out "$ICONSET_DIR/icon_32x32.png" >/dev/null
  sips -z 64 64 "$ICON_PNG" --out "$ICONSET_DIR/icon_32x32@2x.png" >/dev/null
  sips -z 128 128 "$ICON_PNG" --out "$ICONSET_DIR/icon_128x128.png" >/dev/null
  sips -z 256 256 "$ICON_PNG" --out "$ICONSET_DIR/icon_128x128@2x.png" >/dev/null
  sips -z 256 256 "$ICON_PNG" --out "$ICONSET_DIR/icon_256x256.png" >/dev/null
  sips -z 512 512 "$ICON_PNG" --out "$ICONSET_DIR/icon_256x256@2x.png" >/dev/null
  sips -z 512 512 "$ICON_PNG" --out "$ICONSET_DIR/icon_512x512.png" >/dev/null
  cp "$ICON_PNG" "$ICONSET_DIR/icon_512x512@2x.png"

  iconutil --convert icns "$ICONSET_DIR" --output "$ICON_FILE"
  plutil -replace CFBundleIconFile -string "${APP_NAME}.icns" "$APP_CONTENTS/Info.plist"
fi

rm -rf "$APP_RESOURCES/default_app.asar"
mkdir -p "$APP_RUNTIME"

cp "$ROOT_DIR/package.json" "$APP_RUNTIME/package.json"
cp "$ROOT_DIR/index.html" "$APP_RUNTIME/index.html"
cp "$ROOT_DIR/methodology.html" "$APP_RUNTIME/methodology.html"
cp "$ROOT_DIR/style.css" "$APP_RUNTIME/style.css"
cp "$ROOT_DIR/home.css" "$APP_RUNTIME/home.css"
cp "$ROOT_DIR/home.js" "$APP_RUNTIME/home.js"
cp "$ROOT_DIR/app.js" "$APP_RUNTIME/app.js"
cp "$ROOT_DIR/desktop-client.js" "$APP_RUNTIME/desktop-client.js"
cp -R "$ROOT_DIR/assets" "$APP_RUNTIME/assets"
cp -R "$ROOT_DIR/desktop" "$APP_RUNTIME/desktop"
cp -R "$ROOT_DIR/restaurant-database" "$APP_RUNTIME/restaurant-database"

rm -rf "$APP_RUNTIME/restaurant-database/__pycache__"
rm -f "$APP_RUNTIME/restaurant-database/server.py"

codesign --force --deep --sign - "$APP_BUNDLE"
ditto -c -k --sequesterRsrc --keepParent "$APP_DIR" "$RELEASE_DIR/${APP_NAME}-mac.zip"

echo "APP_BUNDLE=$APP_BUNDLE"
echo "ZIP_PATH=$RELEASE_DIR/${APP_NAME}-mac.zip"
