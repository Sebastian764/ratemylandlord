import React, { useMemo } from 'react';
import CityAutocomplete from './CityAutocomplete';
import { US_STATES, cleanCityName, knownCityNamesInState } from '../utils/cities';

interface CityStateSelectorProps {
  cityName: string;
  stateCode: string;
  onCityNameChange: (city: string) => void;
  onStateChange: (state: string) => void;
  /** Full set of known canonical "City, ST" strings, used for city suggestions. */
  knownCities: string[];
  inputClassName?: string;
}

/**
 * State picker (fixed, finite list) + free-text city input. The city field
 * suggests cities already known in the chosen state to encourage reuse and
 * avoid near-duplicates, but accepts brand-new cities so anyone in the US can
 * add their landlord regardless of whether the city exists yet.
 */
const CityStateSelector: React.FC<CityStateSelectorProps> = ({
  cityName,
  stateCode,
  onCityNameChange,
  onStateChange,
  knownCities,
  inputClassName,
}) => {
  const citySuggestions = useMemo(
    () => (stateCode ? knownCityNamesInState(knownCities, stateCode) : []),
    [knownCities, stateCode]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="sm:col-span-1">
        <label htmlFor="state" className="block mb-1 text-sm font-medium text-gray-600">State</label>
        <select
          id="state"
          aria-label="State"
          value={stateCode}
          onChange={(e) => onStateChange(e.target.value)}
          className={inputClassName}
        >
          <option value="">Select…</option>
          {US_STATES.map((s) => (
            <option key={s.code} value={s.code}>
              {s.code} — {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-600">City</label>
        <CityAutocomplete
          id="city"
          ariaLabel="City"
          value={cityName}
          onChange={onCityNameChange}
          options={citySuggestions}
          allowCustom
          cleanCustomValue={cleanCityName}
          placeholder={stateCode ? 'Type your city…' : 'Select a state first'}
          inputClassName={inputClassName}
        />
      </div>
    </div>
  );
};

export default CityStateSelector;
