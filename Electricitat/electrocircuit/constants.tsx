import React from 'react';
import { CircuitElement } from './types';

// Helper for standard stroke style
const StrokePath = (props: React.SVGProps<SVGPathElement>) => (
  <path
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    {...props}
  />
);

const SVGContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 100 60" className="w-full h-full text-slate-800">
    {children}
  </svg>
);

export const CIRCUIT_ELEMENTS: CircuitElement[] = [
  {
    id: 'conductor',
    name: 'Conductor elèctric',
    description: 'Fil que connecta els components i permet el pas del corrent.',
    icon: (
      <SVGContainer>
        <StrokePath d="M0 30 H100" />
      </SVGContainer>
    ),
  },
  {
    id: 'pila',
    name: 'Pila elèctrica',
    description: 'Generador que proporciona energia al circuit (CC).',
    icon: (
      <SVGContainer>
        <StrokePath d="M10 30 H45" />
        <StrokePath d="M45 15 V45" strokeWidth="2.5" /> {/* Long bar + */}
        <StrokePath d="M55 22 V38" strokeWidth="4" /> {/* Short bar - */}
        <StrokePath d="M55 30 H90" />
        <text x="35" y="12" fontSize="10" fill="currentColor">+</text>
      </SVGContainer>
    ),
  },
  {
    id: 'resistencia',
    name: 'Resistència elèctrica',
    description: 'Oposició al pas del corrent. Simbologia IEC (rectangle).',
    icon: (
      <SVGContainer>
        <StrokePath d="M10 30 H30" />
        <rect x="30" y="20" width="40" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
        <StrokePath d="M70 30 H90" />
      </SVGContainer>
    ),
  },
  {
    id: 'polsador_obert',
    name: 'Polsador obert (NA)',
    description: 'Interruptor momentani que no deixa passar corrent si no es prem.',
    icon: (
      <SVGContainer>
        <StrokePath d="M10 30 H40" />
        <StrokePath d="M60 30 H90" />
        <circle cx="40" cy="33" r="2" fill="currentColor" />
        <circle cx="60" cy="33" r="2" fill="currentColor" />
        <StrokePath d="M40 20 H60" /> {/* The bar above */}
        <StrokePath d="M50 20 V12" /> {/* The plunger */}
      </SVGContainer>
    ),
  },
  {
    id: 'polsador_tancat',
    name: 'Polsador tancat (NC)',
    description: 'Interruptor momentani que deixa passar corrent fins que es prem.',
    icon: (
      <SVGContainer>
        <StrokePath d="M10 30 H40" />
        <StrokePath d="M60 30 H90" />
        <circle cx="40" cy="34" r="2" fill="currentColor" />
        <circle cx="60" cy="34" r="2" fill="currentColor" />
        <StrokePath d="M40 34 H60" /> {/* The bar connecting */}
        <StrokePath d="M50 34 V12" /> {/* The plunger */}
      </SVGContainer>
    ),
  },
  {
    id: 'interruptor',
    name: 'Interruptor',
    description: 'Obre o tanca el circuit de manera permanent fins que es torna a accionar.',
    icon: (
      <SVGContainer>
        <StrokePath d="M10 30 H40" />
        <circle cx="40" cy="30" r="2" fill="currentColor" />
        <StrokePath d="M40 30 L55 15" /> {/* Angled lever */}
        <circle cx="60" cy="30" r="2" fill="currentColor" />
        <StrokePath d="M60 30 H90" />
      </SVGContainer>
    ),
  },
  {
    id: 'commutador',
    name: 'Commutador',
    description: 'Permet desviar el corrent per dos camins diferents.',
    icon: (
      <SVGContainer>
        <StrokePath d="M10 30 H40" />
        <circle cx="40" cy="30" r="2" fill="currentColor" />
        
        {/* Output 1 */}
        <circle cx="65" cy="15" r="2" fill="currentColor" />
        <StrokePath d="M65 15 H90" />
        
        {/* Output 2 */}
        <circle cx="65" cy="45" r="2" fill="currentColor" />
        <StrokePath d="M65 45 H90" />

        {/* Lever connecting to top */}
        <StrokePath d="M40 30 L65 15" />
      </SVGContainer>
    ),
  },
  {
    id: 'bombeta',
    name: 'Bombeta',
    description: 'Transforma energia elèctrica en llum.',
    icon: (
      <SVGContainer>
        <StrokePath d="M10 30 H35" />
        <circle cx="50" cy="30" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
        <StrokePath d="M40 20 L60 40" />
        <StrokePath d="M40 40 L60 20" />
        <StrokePath d="M65 30 H90" />
      </SVGContainer>
    ),
  },
  {
    id: 'altaveu',
    name: 'Altaveu',
    description: 'Transforma energia elèctrica en so.',
    icon: (
      <SVGContainer>
        <StrokePath d="M10 20 H30" />
        <StrokePath d="M10 40 H30" />
        <rect x="30" y="15" width="15" height="30" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M45 15 L70 5 V55 L45 45" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      </SVGContainer>
    ),
  },
  {
    id: 'motor',
    name: 'Motor elèctric',
    description: 'Transforma energia elèctrica en moviment.',
    icon: (
      <SVGContainer>
        <StrokePath d="M10 30 H35" />
        <circle cx="50" cy="30" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
        <text x="44" y="34" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="currentColor">M</text>
        <StrokePath d="M65 30 H90" />
      </SVGContainer>
    ),
  },
  {
    id: 'diode_led',
    name: 'Díode LED',
    description: 'Díode que emet llum quan hi passa corrent.',
    icon: (
      <SVGContainer>
        <StrokePath d="M10 30 H35" />
        {/* Triangle */}
        <path d="M35 20 L35 40 L55 30 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Vertical line */}
        <StrokePath d="M55 20 V40" />
        <StrokePath d="M55 30 H80" />
        {/* Arrows */}
        <StrokePath d="M45 15 L55 5" />
        <path d="M53 5 L57 9 L51 9 Z" fill="currentColor" /> 
        <StrokePath d="M55 18 L65 8" />
        <path d="M63 8 L67 12 L61 12 Z" fill="currentColor" />
      </SVGContainer>
    ),
  },
];