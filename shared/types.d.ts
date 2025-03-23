// export type Language = 'English' | 'Frenc

export type Movie =   {
  id: number,
  backdrop_path: string,
  genre_ids: number[ ],
  original_language: string,
  original_title: string,
  adult: boolean,
  overview: string,
  popularity: number,
  poster_path: string,
  release_date: string,
  title: string,
  video: boolean,
  vote_average: number,
  vote_count: number
}

export type MovieCast = {
  movieId: number;
  actorName: string;
  roleName: string;
  roleDescription: string;
};
// Used to validate the query string of HTTP Get requests
export type MovieCastMemberQueryParams = {
  movieId: string;
  actorName?: string;
  roleName?: string
}

export type MovieByIdQueryParams = {
  cast?: string;
}

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
