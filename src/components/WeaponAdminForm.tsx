import React, { useState } from 'react';
import { WeaponFormData, WeaponModFormData, PerkFormData, WEAPON_TYPES, ELEMENTS, COMBAT_STYLES, WEAPON_SLOTS, MOD_CATEGORIES } from '@/types/weapons';
import ImageSelector from './ImageSelector';

import WeaponSlotSelectors from './WeaponSlotSelectors';
interface WeaponAdminFormProps {
  initialData?: WeaponFormData;
  onSubmit: (data: WeaponFormData) => Promise<void>;
  onCancel?: () => void;
}

export const WeaponAdminForm: React.FC<WeaponAdminFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<WeaponFormData>(initialData || {
    name: '',
    rarity: 4,
    weaponType: 'Hand Cannon',
    basePowerMin: 1080,
    basePowerMax: 3130,
    combatStyle: 'Piercing',
    element: 'Arc',
    weaponSlot: 'Primary',
    imageUrl: '',
    thumbnailUrl: '',
    dps: 0,
    precisionBonus: 1.0,
    magazineCapacity: 10,
    rateOfFire: 140,
    damage: 100,
    reloadSpeed: 50,
    stability: 50,
    handling: 50,
    range: 50,
    mods: [],
    compatibleCharacterIds: [],
    perks: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof WeaponFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save weapon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="weapon-admin-form">
      <div className="form-container">
        <h2>{initialData ? 'Edit Weapon' : 'Create New Weapon'}</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Basic Information Section */}
        <section className="form-section">
          <h3>Basic Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Weapon Name *</label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Survivor's Instinct"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rarity">Rarity *</label>
              <select
                id="rarity"
                required
                value={formData.rarity}
                onChange={(e) => handleInputChange('rarity', parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map(r => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weaponType">Weapon Type *</label>
              <select
                id="weaponType"
                required
                value={formData.weaponType}
                onChange={(e) => handleInputChange('weaponType', e.target.value)}
              >
                {WEAPON_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="element">Element *</label>
              <select
                id="element"
                required
                value={formData.element}
                onChange={(e) => handleInputChange('element', e.target.value)}
              >
                {ELEMENTS.map(element => (
                  <option key={element} value={element}>{element}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="combatStyle">Combat Style *</label>
              <select
                id="combatStyle"
                required
                value={formData.combatStyle}
                onChange={(e) => handleInputChange('combatStyle', e.target.value)}
              >
                {COMBAT_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weaponSlot">Weapon Slot *</label>
              <select
                id="weaponSlot"
                required
                value={formData.weaponSlot}
                onChange={(e) => handleInputChange('weaponSlot', e.target.value)}
              >
                {WEAPON_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="basePowerMin">Base Power Min *</label>
              <input
                id="basePowerMin"
                type="number"
                required
                value={formData.basePowerMin}
                onChange={(e) => handleInputChange('basePowerMin', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="basePowerMax">Base Power Max *</label>
              <input
                id="basePowerMax"
                type="number"
                required
                value={formData.basePowerMax}
                onChange={(e) => handleInputChange('basePowerMax', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
<div className="form-row">            <div className="form-group">              <ImageSelector                label="Image URL"                value={formData.imageUrl || ''}                onChange={(url) => handleInputChange('imageUrl', url)}              />            </div>            <div className="form-group">              <ImageSelector                label="Thumbnail URL"                value={formData.thumbnailUrl || ''}                onChange={(url) => handleInputChange('thumbnailUrl', url)}              />            </div>          </div>
          </div>
        </section>
        {/* Traits & Perks Section */}
        <WeaponSlotSelectors
          rarity={formData.rarity}
          intrinsicTraitId={formData.intrinsicTraitId}
          originTraitId={formData.originTraitId}
          perk1Id={formData.perk1Id}
          perk2Id={formData.perk2Id}
          catalystId={formData.catalystId}
          onChange={(field, value) => handleInputChange(field as keyof WeaponFormData, value)}
        />


        {/* Stats Section */}
        <section className="form-section">
          <h3>Weapon Stats</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dps">DPS</label>
              <input
                id="dps"
                type="number"
                value={formData.dps}
                onChange={(e) => handleInputChange('dps', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="damage">Damage</label>
              <input
                id="damage"
                type="number"
                value={formData.damage}
                onChange={(e) => handleInputChange('damage', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="precisionBonus">Precision Bonus</label>
              <input
                id="precisionBonus"
                type="number"
                step="0.1"
                value={formData.precisionBonus}
                onChange={(e) => handleInputChange('precisionBonus', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="magazineCapacity">Magazine Capacity</label>
              <input
                id="magazineCapacity"
                type="number"
                value={formData.magazineCapacity}
                onChange={(e) => handleInputChange('magazineCapacity', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rateOfFire">Rate of Fire</label>
              <input
                id="rateOfFire"
                type="number"
                value={formData.rateOfFire}
                onChange={(e) => handleInputChange('rateOfFire', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reloadSpeed">Reload Speed</label>
              <input
                id="reloadSpeed"
                type="number"
                value={formData.reloadSpeed}
                onChange={(e) => handleInputChange('reloadSpeed', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stability">Stability</label>
              <input
                id="stability"
                type="number"
                value={formData.stability}
                onChange={(e) => handleInputChange('stability', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="handling">Handling</label>
              <input
                id="handling"
                type="number"
                value={formData.handling}
                onChange={(e) => handleInputChange('handling', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="range">Range</label>
              <input
                id="range"
                type="number"
                value={formData.range}
                onChange={(e) => handleInputChange('range', parseInt(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* Mods Section - Separate Component */}
        <WeaponModsSection
          mods={formData.mods}
          onChange={(mods) => handleInputChange('mods', mods)}
        />

        {/* Perks Section - Separate Component */}
        <PerksSection
          perks={formData.perks}
          onChange={(perks) => handleInputChange('perks', perks)}
        />

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : 'Save Weapon'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

// Weapon Mods Section Component
interface WeaponModsSectionProps {
  mods: WeaponModFormData[];
  onChange: (mods: WeaponModFormData[]) => void;
}

const WeaponModsSection: React.FC<WeaponModsSectionProps> = ({ mods, onChange }) => {
  const addMod = () => {
    onChange([...mods, {
      category: 'Ammo',
      name: '',
      effect: '',
      statValue: 0,
      statType: '',
      displayOrder: mods.length
    }]);
  };

  const updateMod = (index: number, field: keyof WeaponModFormData, value: any) => {
    const updated = [...mods];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeMod = (index: number) => {
    onChange(mods.filter((_, i) => i !== index));
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <h3>Weapon Mods</h3>
        <button type="button" onClick={addMod} className="btn btn-small">
          + Add Mod
        </button>
      </div>

      {mods.map((mod, index) => (
        <div key={index} className="mod-item">
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={mod.category}
                onChange={(e) => updateMod(index, 'category', e.target.value)}
              >
                {MOD_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Mod Name</label>
              <input
                type="text"
                value={mod.name}
                onChange={(e) => updateMod(index, 'name', e.target.value)}
                placeholder="e.g., Ballistic Ammo"
              />
            </div>

            <div className="form-group">
              <label>Effect</label>
              <input
                type="text"
                value={mod.effect}
                onChange={(e) => updateMod(index, 'effect', e.target.value)}
                placeholder="e.g., +1.5% weapon damage"
              />
            </div>

            <button
              type="button"
              onClick={() => removeMod(index)}
              className="btn btn-danger btn-small"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

// Perks Section Component
interface PerksSectionProps {
  perks: PerkFormData[];
  onChange: (perks: PerkFormData[]) => void;
}

const PerksSection: React.FC<PerksSectionProps> = ({ perks, onChange }) => {
  const addPerk = () => {
    onChange([...perks, {
      perkName: '',
      perkDescription: '',
      perkType: '',
      displayOrder: perks.length
    }]);
  };

  const updatePerk = (index: number, field: keyof PerkFormData, value: any) => {
    const updated = [...perks];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removePerk = (index: number) => {
    onChange(perks.filter((_, i) => i !== index));
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <h3>Perks</h3>
        <button type="button" onClick={addPerk} className="btn btn-small">
          + Add Perk
        </button>
      </div>

      {perks.map((perk, index) => (
        <div key={index} className="perk-item">
          <div className="form-row">
            <div className="form-group">
              <label>Perk Name</label>
              <input
                type="text"
                value={perk.perkName}
                onChange={(e) => updatePerk(index, 'perkName', e.target.value)}
                placeholder="e.g., Firefly"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={perk.perkDescription}
                onChange={(e) => updatePerk(index, 'perkDescription', e.target.value)}
                placeholder="Perk description..."
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <input
                type="text"
                value={perk.perkType}
                onChange={(e) => updatePerk(index, 'perkType', e.target.value)}
                placeholder="e.g., Offensive"
              />
            </div>

            <button
              type="button"
              onClick={() => removePerk(index)}
              className="btn btn-danger btn-small"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default WeaponAdminForm;
