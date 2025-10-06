import React, { useState, useEffect } from 'react';
import { WeaponFormData, WeaponModFormData, PerkFormData, WEAPON_TYPES, ELEMENTS, COMBAT_STYLES, MOD_CATEGORIES } from '@/types/weapons';
import ImageSelector from './ImageSelector';
import { getCombatStyleImage, getWeaponSlotImage, getElementImage, getCharacterImage, getRarityStarsData } from '@/lib/image-assets';

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
    basePower: 1500,
    combatStyle: 'Piercing',
    element: 'Arc',
    slot: 'Primary',
    imageUrl: '',
    dps: 0,
    precisionBonus: 1.0,
    magazineCap: 10,
    rateOfFire: 140,
    maxAmmo: 100,
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
  const [characters, setCharacters] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        setCharacters(data);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    fetchCharacters();
  }, []);

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
                {[1, 2, 3, 4, 5, 6].map(r => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
              <div className="form-hint flex items-center gap-1 mt-2">
                Current rarity: {getRarityStarsData(formData.rarity).map((star) => (
                  <img
                    key={star.key}
                    src={star.src}
                    alt={star.alt}
                    className={star.className}
                  />
                ))}
              </div>
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
              {formData.element && getElementImage(formData.element) && (
                <div className="form-hint flex items-center gap-2 mt-2">
                  <img
                    src={getElementImage(formData.element)!}
                    alt={formData.element}
                    className="w-6 h-6"
                  />
                  <span>{formData.element} Element</span>
                </div>
              )}
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
              {formData.combatStyle && getCombatStyleImage(formData.combatStyle) && (
                <div className="form-hint flex items-center gap-2 mt-2">
                  <img
                    src={getCombatStyleImage(formData.combatStyle)!}
                    alt={formData.combatStyle}
                    className="w-6 h-6"
                  />
                  <span>{formData.combatStyle}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="slot">Weapon Slot *</label>
              <select
                id="slot"
                required
                value={formData.slot}
                onChange={(e) => handleInputChange('slot', e.target.value)}
              >
                <option value="Primary">Primary</option>
                <option value="Power">Power</option>
              </select>
              {formData.slot && getWeaponSlotImage(formData.slot) && (
                <div className="form-hint flex items-center gap-2 mt-2">
                  <img
                    src={getWeaponSlotImage(formData.slot)!}
                    alt={formData.slot}
                    className="w-6 h-6"
                  />
                  <span>{formData.slot} Weapon</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="basePower">Base Power *</label>
              <input
                id="basePower"
                type="number"
                required
                value={formData.basePower}
                onChange={(e) => handleInputChange('basePower', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <ImageSelector
                label="Image URL"
                value={formData.imageUrl || ''}
                onChange={(url) => handleInputChange('imageUrl', url)}
              />
            </div>
          </div>
        </section>

        {/* Compatible Characters Section */}
        <section className="form-section">
          <h3>Compatible Characters</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Select Compatible Characters</label>
              <div className="character-checkboxes">
                {characters.map(character => (
                  <label key={character.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.compatibleCharacterIds.includes(character.id)}
                      onChange={(e) => {
                        const characterIds = formData.compatibleCharacterIds;
                        if (e.target.checked) {
                          handleInputChange('compatibleCharacterIds', [...characterIds, character.id]);
                        } else {
                          handleInputChange('compatibleCharacterIds', characterIds.filter(id => id !== character.id));
                        }
                      }}
                    />
                    {getCharacterImage(character.name) && (
                      <img
                        src={getCharacterImage(character.name)!}
                        alt={character.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span>{character.name}</span>
                  </label>
                ))}
              </div>
              {formData.compatibleCharacterIds.length === 0 && (
                <p className="form-hint">Select at least one compatible character</p>
              )}
            </div>
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
              <label htmlFor="magazineCap">Magazine Capacity</label>
              <input
                id="magazineCap"
                type="number"
                value={formData.magazineCap}
                onChange={(e) => handleInputChange('magazineCap', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxAmmo">Max Ammo</label>
              <input
                id="maxAmmo"
                type="number"
                value={formData.maxAmmo}
                onChange={(e) => handleInputChange('maxAmmo', parseInt(e.target.value))}
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
