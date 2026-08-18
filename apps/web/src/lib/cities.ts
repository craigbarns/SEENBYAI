export interface City {
  slug: string;
  name: string;
  state: string;
  stateCode: string;
  population: string;
}

export const cities: City[] = [
  { slug: "austin-tx", name: "Austin", state: "Texas", stateCode: "TX", population: "975,000" },
  { slug: "miami-fl", name: "Miami", state: "Florida", stateCode: "FL", population: "450,000" },
  { slug: "dallas-tx", name: "Dallas", state: "Texas", stateCode: "TX", population: "1,300,000" },
  { slug: "phoenix-az", name: "Phoenix", state: "Arizona", stateCode: "AZ", population: "1,600,000" },
  { slug: "los-angeles-ca", name: "Los Angeles", state: "California", stateCode: "CA", population: "3,800,000" },
  { slug: "chicago-il", name: "Chicago", state: "Illinois", stateCode: "IL", population: "2,700,000" },
  { slug: "houston-tx", name: "Houston", state: "Texas", stateCode: "TX", population: "2,300,000" },
  { slug: "atlanta-ga", name: "Atlanta", state: "Georgia", stateCode: "GA", population: "500,000" },
  { slug: "denver-co", name: "Denver", state: "Colorado", stateCode: "CO", population: "715,000" },
  { slug: "seattle-wa", name: "Seattle", state: "Washington", stateCode: "WA", population: "750,000" },
];

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
