#!/bin/bash

# Multi-resolution Video Processing Script for TVPro
# 
# Usage:
#   ./scripts/process-video.sh
#
# Drop all source videos into scripts/input/
# Results will be in scripts/output/<video-name>/
#   ├── <name>-480p.mp4
#   ├── <name>-720p.mp4
#   ├── <name>-1080p.mp4
#   └── <name>-thumb.webp

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT_DIR="$SCRIPT_DIR/input"
OUTPUT_DIR="$SCRIPT_DIR/output"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ Error: ffmpeg is not installed. Install it with: brew install ffmpeg"
    exit 1
fi

# Check if input directory exists and has files
if [ ! -d "$INPUT_DIR" ]; then
    mkdir -p "$INPUT_DIR"
    echo "📁 Created input directory: $INPUT_DIR"
    echo "   Drop your video files there and run this script again."
    exit 0
fi

# Collect video files into an array
FILES=()
while IFS= read -r -d '' f; do
    FILES+=("$f")
done < <(find "$INPUT_DIR" -maxdepth 1 -type f \( -iname "*.mov" -o -iname "*.mp4" -o -iname "*.avi" -o -iname "*.mkv" -o -iname "*.webm" -o -iname "*.m4v" \) -print0 | sort -z)

TOTAL=${#FILES[@]}

if [ "$TOTAL" -eq 0 ]; then
    echo "📁 No video files found in $INPUT_DIR"
    echo "   Supported formats: .mov, .mp4, .avi, .mkv, .webm, .m4v"
    exit 0
fi

CURRENT=0

echo "🎬 Found $TOTAL video(s) in input/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

for FILE in "${FILES[@]}"; do
    CURRENT=$((CURRENT + 1))
    BASENAME=$(basename "$FILE")
    NAME="${BASENAME%.*}"
    
    # Create output directory for this video
    VIDEO_OUT="$OUTPUT_DIR/$NAME"
    mkdir -p "$VIDEO_OUT"
    
    echo "[$CURRENT/$TOTAL] Processing: $BASENAME"
    echo "         → $VIDEO_OUT/"
    
    # Skip if already processed
    if [ -f "$VIDEO_OUT/${NAME}-720p.mp4" ]; then
        echo "         ⏭  Already processed, skipping. Delete output folder to re-process."
        echo ""
        continue
    fi

    # 1080p - High Quality (desktop full-screen / modal)
    echo "         🔹 1080p..."
    ffmpeg -i "$FILE" -vf "scale='min(1920,iw)':-2" \
        -c:v libx264 -crf 26 -preset slow \
        -c:a aac -b:a 128k \
        -movflags +faststart \
        -y "$VIDEO_OUT/${NAME}-1080p.mp4" 2>/dev/null

    # 720p - Standard Quality (desktop / tablet)
    echo "         🔹 720p..."
    ffmpeg -i "$FILE" -vf "scale='min(1280,iw)':-2" \
        -c:v libx264 -crf 28 -preset slow \
        -c:a aac -b:a 96k \
        -movflags +faststart \
        -y "$VIDEO_OUT/${NAME}-720p.mp4" 2>/dev/null

    # 480p - Mobile Quality
    echo "         🔹 480p..."
    ffmpeg -i "$FILE" -vf "scale='min(854,iw)':-2" \
        -c:v libx264 -crf 30 -preset slow \
        -c:a aac -b:a 64k \
        -movflags +faststart \
        -y "$VIDEO_OUT/${NAME}-480p.mp4" 2>/dev/null

    # Thumbnail (WebP from 2nd second)
    echo "         🔹 thumbnail..."
    ffmpeg -i "$FILE" -ss 00:00:02 -vframes 1 \
        -vf "scale='min(1280,iw)':-2" \
        -c:v libwebp -quality 80 \
        -y "$VIDEO_OUT/${NAME}-thumb.webp" 2>/dev/null

    # Report sizes
    ORIG_SIZE=$(du -h "$FILE" | cut -f1)
    SIZE_1080=$(du -h "$VIDEO_OUT/${NAME}-1080p.mp4" 2>/dev/null | cut -f1)
    SIZE_720=$(du -h "$VIDEO_OUT/${NAME}-720p.mp4" 2>/dev/null | cut -f1)
    SIZE_480=$(du -h "$VIDEO_OUT/${NAME}-480p.mp4" 2>/dev/null | cut -f1)
    SIZE_THUMB=$(du -h "$VIDEO_OUT/${NAME}-thumb.webp" 2>/dev/null | cut -f1)
    
    echo "         ✅ Done!"
    echo "         Original: $ORIG_SIZE → 1080p: $SIZE_1080 | 720p: $SIZE_720 | 480p: $SIZE_480 | thumb: $SIZE_THUMB"
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All done! Results in: scripts/output/"
echo ""
echo "Next steps:"
echo "  1. Review thumbnails in output/*/  (adjust -ss timestamp if bad)"
echo "  2. Upload to Strapi: each folder = one selfHostedVideo component"
echo "  3. For each video in Strapi, upload:"
echo "     • thumbnail  → *-thumb.webp"
echo "     • video480   → *-480p.mp4"
echo "     • video720   → *-720p.mp4"
echo "     • video1080  → *-1080p.mp4"
