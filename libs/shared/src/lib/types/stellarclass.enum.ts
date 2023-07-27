export enum StellarClass {

  // Single Stars
  GType = 0, // Regular sun like star in the main sequence
  RedDwarf = 1, // Technically main sequence, but since they are the most common they get their own type
  RedGiant = 2,
  BlueGiant = 3,
  SuperGiant = 4,
  WhiteDwarf = 5,
  Pulsar = 6,
  NeutronStar = 7,

  // Binary Systems
  // MSMS = 8,           // Main Sequence + Main Sequence    (pick from the MS pool)
  // MSRD = 9,           // Main Sequence + Red Dwarf        (pick from both RD pool)
  // WDMS = 10,          // Main Sequence + WD               (pick from the MS pool)

  // // Double Degenerate Systems
  // WDWD = 11,          // White Dwarf + White Dwarf        (pick from the WD pool)
  // PSRWD  = 12,          // Pulsar + WD                      (pick from the Pulsar pool)
  // NSWD = 13,          // Neutron Star + WD                (pick from the Neutron Star pool)
}
