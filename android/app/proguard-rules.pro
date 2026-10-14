# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Nitro (nitro-modules, nitro-image, vision-camera) resolves its Kotlin classes from C++
# through fbjni by name. They are annotated @Keep/@DoNotStrip, but a class that is only
# reached from native code is easy to miss, so keep the whole namespace.
-keep class com.margelo.nitro.** { *; }

# Hermes / React Native bridge classes looked up from native code.
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
