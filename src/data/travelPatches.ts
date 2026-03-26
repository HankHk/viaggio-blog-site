/**
 * Dati per le toppe da viaggio decorative (badge / patch vintage).
 * top e left in percentuale (0–100), rotation in gradi.
 */

export interface TravelPatchData {
  city: string;
  country: string;
  /** URL immagine opzionale (icona o landmark) */
  image?: string;
  top: number;
  left: number;
  rotation: number;
}

export const travelPatches: TravelPatchData[] = [
  { city: "New York", country: "USA", top: 8, left: 5, rotation: -8 },
  { city: "Tokyo", country: "Giappone", top: 18, left: 88, rotation: 12 },
  { city: "Parigi", country: "Francia", top: 28, left: 12, rotation: 5 },
  { city: "Londra", country: "Regno Unito", top: 42, left: 82, rotation: -10 },
  { city: "Berlino", country: "Germania", top: 62, left: 85, rotation: -6 },
  { city: "Sydney", country: "Australia", top: 72, left: 15, rotation: -12 },
  { city: "Il Cairo", country: "Egitto", top: 78, left: 90, rotation: 9 },
  { city: "Rio de Janeiro", country: "Brasile", top: 85, left: 6, rotation: 4 },
  { city: "Barcellona", country: "Spagna", top: 35, left: 78, rotation: -7 },
  { city: "Amsterdam", country: "Paesi Bassi", top: 48, left: 92, rotation: 11 },
  { city: "Kyoto", country: "Giappone", top: 22, left: 3, rotation: -5 },
];
