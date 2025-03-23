export interface Pokemon {
  id: number
  exists: boolean
  name: PokemonName
  type: string[]
  base: PokemonBase
  species: string
  description: string
  evolution: PokemonEvolution
  profile: PokemonProfile
  image: PokemonImage
}

export interface PokemonName {
  english: string
  japanese: string
  chinese: string
  french: string
}

export interface PokemonBase {
  HP: number
  Attack: number
  Defense: number
  "Sp. Attack": number
  "Sp. Defense": number
  Speed: number
}

export interface PokemonEvolution {
  next?: string[][]
  prev?: string[]
}

export interface PokemonProfile {
  height: string
  weight: string
  egg: string[]
  ability: string[][]
  gender: string
}

export interface PokemonImage {
  sprite: string
  thumbnail: string
  hires: string
}

export type AllPokemonQueryParams = {
  descriptionContains?: string;
}

export type TranslatedPokemonByIdQueryParams = {
  language: string;
}
