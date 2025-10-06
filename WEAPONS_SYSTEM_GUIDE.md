# Weapons System - Complete Guide

## 📋 Overview

Complete weapon management system with traits, perks, catalysts, and enhanced mods for Destiny Rising.

## 🗄️ Database Structure

### Core Tables

1. **weapons** - Main weapon data
2. **traits** - Intrinsic & Origin traits
3. **weapon_perks** - Perks for slots 3 & 4
4. **catalysts** - Exotic/6-star weapon catalysts
5. **weapon_mods** - Enhanced mods with attributes
6. **mod_attributes** - Stat bonuses for mods
7. **mod_rarities** - Rare, Legendary, Mythic, Exotic

### Weapon Slots

**Slot 1: Intrinsic Trait**
- Core weapon behavior
- Examples: "Aggressive Frame", "Lightweight Frame"

**Slot 2: Origin Trait**
- Special trait based on weapon origin
- Examples: "Vanguard's Might", "Crucible Legend"

**Slot 3: Perk 1**
- First selectable perk
- Examples: "Rampage", "Kill Clip", "Firefly"

**Slot 4: Perk 2**
- Second selectable perk
- Examples: "Outlaw", "Feeding Frenzy", "Dragonfly"

**Catalyst (6-star/Exotic only)**
- Special enhancement
- Examples: "Enhanced Damage", "Master Reload"

### Mod System

**Categories:**
- Ammo Mods
- Scope Mods
- Magazine Mods

**Rarity System:**
- **Rare**: 1 main attribute + 1 random attribute
- **Legendary**: 1 main attribute + 2 random attributes
- **Mythic**: 1 main attribute + 2 random attributes
- **Exotic**: 1 main attribute + 2 random attributes

**Combat Style Compatibility:**
- Rapid-fire
- Impact
- Piercing
- Spread

**Mod Features:**
- Main attributes (selected)
- Random attributes (pool)
- Perk upgrades (unlocks sub-perks)
- Combat style requirements

## 🎯 Setup Instructions

### 1. Run Database Schema

```bash
# Run extended schema
psql -U your_user -d your_database -f prisma/weapons-extended-schema.sql
```

This creates:
- All new tables
- Sample traits, perks, catalysts
- Sample mod attributes
- Default mod rarities

### 2. Admin Pages

Navigate to these pages to manage content:

- `/admin/weapons` - Manage weapons
- `/admin/traits` - Manage traits
- `/admin/perks` - Manage perks
- `/admin/catalysts` - Manage catalysts
- `/admin/mods` - Manage mods
- `/admin/attributes` - Manage mod attributes

### 3. Creating Weapons

**Step 1: Create Traits**
1. Go to `/admin/traits`
2. Create Intrinsic traits (Slot 1)
3. Create Origin traits (Slot 2)

**Step 2: Create Perks**
1. Go to `/admin/perks`
2. Create perks for Slot 3
3. Create perks for Slot 4

**Step 3: Create Catalysts** (Optional - for 6-star weapons)
1. Go to `/admin/catalysts`
2. Create catalyst with effects
3. Add unlock requirements

**Step 4: Create Mod Attributes**
1. Go to `/admin/attributes`
2. Create stat bonuses (e.g., "+5% damage")

**Step 5: Create Mods**
1. Go to `/admin/mods`
2. Select category (Ammo/Scope/Magazine)
3. Choose rarity
4. Select main attributes
5. Select random attribute pool
6. Choose combat style compatibility
7. (Optional) Select perks that mod can upgrade

**Step 6: Create Weapon**
1. Go to `/admin/weapons/new`
2. Fill basic info
3. **Select Slot 1**: Intrinsic Trait
4. **Select Slot 2**: Origin Trait
5. **Select Slot 3**: Perk 1
6. **Select Slot 4**: Perk 2
7. (If 6-star) **Select Catalyst**
8. **Select Ammo Mods**: Choose from available ammo mods
9. **Select Scope Mods**: Choose from available scope mods
10. **Select Magazine Mods**: Choose from available magazine mods
11. Save weapon

## 📊 Data Examples

### Trait Example
```json
{
  "name": "Aggressive Frame",
  "type": "intrinsic",
  "description": "High damage, high recoil",
  "effect": "+800 power to the weapon"
}
```

### Perk Example
```json
{
  "name": "Rampage",
  "slot": 3,
  "description": "Kills increase damage",
  "effect": "Stacking damage buff up to 3x"
}
```

### Catalyst Example
```json
{
  "name": "Enhanced Damage",
  "description": "Significantly increases weapon damage",
  "effect": "+25% base damage",
  "requirementDescription": "Complete 500 kills with this weapon"
}
```

### Enhanced Mod Example
```json
{
  "name": "Precision Scope MK-III",
  "category": "Scope",
  "rarity": "Exotic",
  "description": "Advanced targeting system",
  "combatStyle": "piercing",
  "mainAttributes": [
    {"name": "Precision Bonus", "statBonus": "+8% precision damage"}
  ],
  "randomAttributes": [
    {"name": "Stability Increase", "statBonus": "+15 stability"},
    {"name": "Range Extension", "statBonus": "+20 range"}
  ],
  "unlocksPerkUpgrade": true,
  "upgradablePerks": ["Firefly"],
  "perkUpgradeDescription": "Firefly explosions deal 50% more damage"
}
```

## 🔄 Workflow

### Admin Content Creation Order:
1. ✅ Create Traits (Intrinsic & Origin)
2. ✅ Create Perks (Slots 3 & 4)
3. ✅ Create Catalysts (for Exotics)
4. ✅ Create Mod Attributes
5. ✅ Create Mods (with attributes & perk upgrades)
6. ✅ Create Weapons (assign traits, perks, mods, catalyst)

### Mod Assignment Rules:
- Each weapon can have multiple mods per category
- Mods must match weapon combat style (or be universal)
- Rare mods: 1 main + 1 random
- Legendary/Mythic/Exotic: 1 main + 2 random

## 🎮 Features

### Trait System
- ✅ Slot-based selection (1=Intrinsic, 2=Origin)
- ✅ Type filtering
- ✅ Effect descriptions
- ✅ Icon support

### Perk System
- ✅ 4-slot system (1-2 traits, 3-4 perks)
- ✅ Slot validation
- ✅ Effect descriptions
- ✅ Mod upgrade compatibility

### Catalyst System
- ✅ 6-star/Exotic exclusive
- ✅ Unlock requirements
- ✅ Powerful effects
- ✅ Quest descriptions

### Enhanced Mod System
- ✅ Rarity-based attributes
- ✅ Main + random attributes
- ✅ Perk upgrade unlocks
- ✅ Combat style filtering
- ✅ Category organization

## 🚀 Next Steps

1. Run the extended schema SQL
2. Create admin UI pages for traits/perks/catalysts
3. Update weapon form with slot selectors
4. Create mod management UI
5. Test complete workflow

## 📝 Notes

- Weapons with rarity < 6 cannot have catalysts
- Mods can upgrade multiple perks
- Each perk upgrade has its own description
- Random attributes are rolled from the pool
- Combat style "null" means compatible with all styles
