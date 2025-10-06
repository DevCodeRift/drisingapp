#!/bin/bash

# Script to rename weapon images by removing ONLY the final 8-character random hash

cd /home/tcullen/drisingapp/public/images/weapons

echo "Starting weapon image renaming process..."

# Get all weapon type directories
weapon_dirs=$(ls -d */ | sed 's/\///g')

# Process each weapon type directory
for weapon_dir in $weapon_dirs; do
    if [ -d "$weapon_dir" ]; then
        echo "Processing $weapon_dir..."
        cd "$weapon_dir"

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
        echo "Directory $weapon_dir not found, skipping..."
    fi
done

echo "Weapon image renaming complete!"