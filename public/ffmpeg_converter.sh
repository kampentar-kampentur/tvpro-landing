#!/bin/bash

# Создаем папку optimized, если её нет
mkdir -p optimized

# Проверяем, установлен ли ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "FFmpeg не найден. Установите его через Homebrew:"
    echo "brew install ffmpeg"
    exit 1
fi

# Собираем список файлов
IFS=$'\n' files=($(find . -maxdepth 1 -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.avi" -o -iname "*.mkv" \)))
unset IFS

total_files=${#files[@]}
current_file=0

echo "Найдено $total_files видеофайлов для обработки..."
echo ""

# Обрабатываем файлы
for video in "${files[@]}"; do
    current_file=$((current_file + 1))
    
    # Получаем имя файла без расширения
    filename=$(basename "$video")
    name="${filename%.*}"
    
    echo "[$current_file/$total_files] Обрабатываю: $video"
    
    # 720p (Более сильное сжатие для Cloudflare 25MB limit)
    echo "  → Создаю 720p версию..."
    ffmpeg -i "$video" -c:v libx264 -crf 28 -preset slow -vf "scale=-2:720" -c:a aac -b:a 128k "optimized/${name}-720p.mp4" -y -loglevel error
    
    # 480p
    echo "  → Создаю 480p версию..."
    ffmpeg -i "$video" -c:v libx264 -crf 28 -preset medium -vf "scale=-2:480" -c:a aac -b:a 96k "optimized/${name}-480p.mp4" -y -loglevel error
    
    # 360p
    echo "  → Создаю 360p версию..."
    ffmpeg -i "$video" -c:v libx264 -crf 30 -preset medium -vf "scale=-2:360" -c:a aac -b:a 64k "optimized/${name}-360p.mp4" -y -loglevel error
    
    echo "  ✅ Готово: $name"
    echo ""
done

echo "🎉 Все видео обработаны! Результаты в папке 'optimized'"