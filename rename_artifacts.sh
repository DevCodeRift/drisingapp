#!/bin/bash

# Script to rename artifact images by removing ONLY the final random hash

cd /home/tcullen/drisingapp/public/images/artifacts

echo "Starting artifact image renaming process..."

# Process each slot directory
for slot_dir in slot1 slot2 slot3 slot4; do
    if [ -d "$slot_dir" ]; then
        echo "Processing $slot_dir..."
        cd "$slot_dir"

        # Rename all .webp files in current directory
        for file in *.webp; do
            if [ -f "$file" ]; then
                # Remove ONLY the final 8-character random hash
                # Pattern: -[8 chars that can be letters, numbers, hyphens, underscores].webp
                newname=$(echo "$file" | sed 's/-[A-Za-z0-9_-]\{8\}\.webp$/.webp/')

                if [ "$file" != "$newname" ]; then
                    echo "  Renaming: $file -> $newname"
                    mv "$file" "$newname"
                else
                    echo "  Skipping: $file (already clean or no hash pattern)"
                fi
            fi
        done

        cd ..
    else
        echo "Directory $slot_dir not found, skipping..."
    fi
done

echo "Artifact image renaming complete!"