// Events store a colour as a hex string. New events pick from the colours
// below; events saved earlier used other colours, which map onto these so every
// event stays in the scheme.
export const EVENT_COLORS = [
  { name: 'primary', label: 'Cobalt', hex: '#1F3F8F' },
  { name: 'slate', label: 'Slate', hex: '#4A5568' },
  { name: 'amber', label: 'Amber', hex: '#8A5A00' }
];

const LEGACY = {
  // the original picker
  '#1e90ff': 'primary',
  '#1976d2': 'primary',
  '#ff0000': 'amber',
  '#008000': 'slate',
  '#ff69b4': 'amber',
  '#800080': 'slate',
  '#ffa500': 'amber',
  // earlier redesigns
  '#c94a26': 'amber',
  '#f4be2e': 'amber',
  '#0f6e6e': 'slate',
  '#84336f': 'slate',
  '#2fb5aa': 'slate',
  '#1f7347': 'slate'
};

// The theme colour name for a stored event colour, cobalt when unknown
export function eventColor(hex) {
  const key = String(hex || '').toLowerCase();
  const match = EVENT_COLORS.find(c => c.hex.toLowerCase() === key);
  return match ? match.name : LEGACY[key] || 'primary';
}
