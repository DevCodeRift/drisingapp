'use client';

import { useState, useEffect } from 'react';

interface Trait {
  id: number;
  name: string;
  type: string;
  description?: string;
  effect?: string;
}

interface Perk {
  id: number;
  name: string;
  slot: number;
  description?: string;
  effect?: string;
}

interface Catalyst {
  id: number;
  name: string;
  description?: string;
  effect?: string;
}

interface WeaponSlotSelectorsProps {
  rarity: number;
  intrinsicTraitId?: number;
  originTraitId?: number;
  perk1Id?: number;
  perk2Id?: number;
  catalystId?: number;
  onChange: (field: string, value: any) => void;
}

export default function WeaponSlotSelectors({
  rarity,
  intrinsicTraitId,
  originTraitId,
  perk1Id,
  perk2Id,
  catalystId,
  onChange
}: WeaponSlotSelectorsProps) {
  const [intrinsicTraits, setIntrinsicTraits] = useState<Trait[]>([]);
  const [originTraits, setOriginTraits] = useState<Trait[]>([]);
  const [perks3, setPerks3] = useState<Perk[]>([]);
  const [perks4, setPerks4] = useState<Perk[]>([]);
  const [catalysts, setCatalysts] = useState<Catalyst[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [intrinsicRes, originRes, perks3Res, perks4Res, catalystsRes] = await Promise.all([
          fetch('/api/traits?type=intrinsic'),
          fetch('/api/traits?type=origin'),
          fetch('/api/perks?slot=3'),
          fetch('/api/perks?slot=4'),
          fetch('/api/catalysts')
        ]);

        const intrinsicData = await intrinsicRes.json();
        const originData = await originRes.json();
        const perks3Data = await perks3Res.json();
        const perks4Data = await perks4Res.json();
        const catalystsData = await catalystsRes.json();

        setIntrinsicTraits(intrinsicData.traits || []);
        setOriginTraits(originData.traits || []);
        setPerks3(perks3Data.perks || []);
        setPerks4(perks4Data.perks || []);
        setCatalysts(catalystsData.catalysts || []);
      } catch (error) {
        console.error('Error loading slot data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading traits and perks...</div>;
  }

  return (
    <section className="form-section">
      <h3>Weapon Traits & Perks</h3>

      {/* Slot 1: Intrinsic Trait */}
      <div className="form-group">
        <label htmlFor="intrinsicTrait">Slot 1: Intrinsic Trait</label>
        <select
          id="intrinsicTrait"
          value={intrinsicTraitId || ''}
          onChange={(e) => onChange('intrinsicTraitId', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">-- Select Intrinsic Trait --</option>
          {intrinsicTraits.map(trait => (
            <option key={trait.id} value={trait.id}>
              {trait.name} {trait.effect && `- ${trait.effect}`}
            </option>
          ))}
        </select>
        {intrinsicTraitId && intrinsicTraits.find(t => t.id === intrinsicTraitId)?.description && (
          <small className="trait-description">
            {intrinsicTraits.find(t => t.id === intrinsicTraitId)?.description}
          </small>
        )}
      </div>

      {/* Slot 2: Origin Trait */}
      <div className="form-group">
        <label htmlFor="originTrait">Slot 2: Origin Trait</label>
        <select
          id="originTrait"
          value={originTraitId || ''}
          onChange={(e) => onChange('originTraitId', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">-- Select Origin Trait --</option>
          {originTraits.map(trait => (
            <option key={trait.id} value={trait.id}>
              {trait.name} {trait.effect && `- ${trait.effect}`}
            </option>
          ))}
        </select>
        {originTraitId && originTraits.find(t => t.id === originTraitId)?.description && (
          <small className="trait-description">
            {originTraits.find(t => t.id === originTraitId)?.description}
          </small>
        )}
      </div>

      {/* Slot 3: Perk 1 */}
      <div className="form-group">
        <label htmlFor="perk1">Slot 3: Perk 1</label>
        <select
          id="perk1"
          value={perk1Id || ''}
          onChange={(e) => onChange('perk1Id', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">-- Select Perk 1 --</option>
          {perks3.map(perk => (
            <option key={perk.id} value={perk.id}>
              {perk.name} {perk.effect && `- ${perk.effect}`}
            </option>
          ))}
        </select>
        {perk1Id && perks3.find(p => p.id === perk1Id)?.description && (
          <small className="trait-description">
            {perks3.find(p => p.id === perk1Id)?.description}
          </small>
        )}
      </div>

      {/* Slot 4: Perk 2 */}
      <div className="form-group">
        <label htmlFor="perk2">Slot 4: Perk 2</label>
        <select
          id="perk2"
          value={perk2Id || ''}
          onChange={(e) => onChange('perk2Id', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">-- Select Perk 2 --</option>
          {perks4.map(perk => (
            <option key={perk.id} value={perk.id}>
              {perk.name} {perk.effect && `- ${perk.effect}`}
            </option>
          ))}
        </select>
        {perk2Id && perks4.find(p => p.id === perk2Id)?.description && (
          <small className="trait-description">
            {perks4.find(p => p.id === perk2Id)?.description}
          </small>
        )}
      </div>

      {/* Catalyst (6-star/Exotic only) */}
      {rarity >= 6 && (
        <div className="form-group">
          <label htmlFor="catalyst">Catalyst (Exotic/6-Star)</label>
          <select
            id="catalyst"
            value={catalystId || ''}
            onChange={(e) => onChange('catalystId', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">-- Select Catalyst --</option>
            {catalysts.map(catalyst => (
              <option key={catalyst.id} value={catalyst.id}>
                {catalyst.name} {catalyst.effect && `- ${catalyst.effect}`}
              </option>
            ))}
          </select>
          {catalystId && catalysts.find(c => c.id === catalystId)?.description && (
            <small className="trait-description">
              {catalysts.find(c => c.id === catalystId)?.description}
            </small>
          )}
        </div>
      )}

      <style jsx>{`
        .trait-description {
          display: block;
          margin-top: 5px;
          color: #6b7280;
          font-size: 13px;
        }
      `}</style>
    </section>
  );
}
