#!/bin/bash
KEYSTORE="kstore.jks"
APK_DIR="app/build/outputs/apk/release"
curl "http://localhost:8081/index.android.bundle?platform=android" -o "app/src/main/assets/index.android.bundle"
./gradlew assembleRelease
jarsigner -verbose -keystore $KSTORE $APK_DIR/app-release-unsigned.apk kstore
zipalign -f -v 4 $APK_DIR/app-release-unsigned.apk $APK_DIR/app-release-signed.apk 
