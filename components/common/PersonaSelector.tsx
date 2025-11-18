
// FIX: Implemented the PersonaSelector component.
import React from 'react';
import { Persona } from '../../constants';
import { Select } from './Select';

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onChange: (persona: Persona) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onChange }) => {
  return (
    <div>
      <label htmlFor="persona-select" className="block text-sm font-medium text-gray-300 mb-2">
        Choose AI Persona
      </label>
      <Select
        id="persona-select"
        value={selectedPersona}
        onChange={(e) => onChange(e.target.value as Persona)}
      >
        <option value={Persona.Expert}>Expert Physicist (Formal & technical)</option>
        <option value={Persona.Tutor}>Friendly Tutor (Clear & encouraging)</option>
        <option value={Persona.Kid}>For a 5-year-old (Simple & uses analogies)</option>
        <option value={Persona.Storyteller}>Storyteller (Creative & narrative-driven)</option>
      </Select>
    </div>
  );
};
