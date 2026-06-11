/** Единый список object-slug для service×object и 3D matrix */
export const OBJECT_SLUGS = [
  "sklad", "ofis", "tc", "zavod", "restoran", "gostinica", "shkola", "bolnica", "parking", "dc",
] as const;

export type ObjectSlug = (typeof OBJECT_SLUGS)[number];
