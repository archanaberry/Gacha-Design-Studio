#!/bin/bash

# Mulai dari folder saat ini
find . -type d | while read -r dir; do
    # Hitung file biasa (bukan folder) di folder tsb (tanpa rekursif)
    file_count=$(find "$dir" -maxdepth 1 -type f ! -name ".test" | wc -l)

    # Jika tidak ada file sama sekali
    if [ "$file_count" -eq 0 ]; then
        # Buat .test jika belum ada
        if [ ! -f "$dir/.test" ]; then
            touch "$dir/.test"
            echo "Created: $dir/.test"
        fi
    fi
done
