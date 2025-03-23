# Serverless REST Assignment - Distributed Systems

__Name:__ Piotr Placzek (20097618)

__Demo:__ ... link to your YouTube video demonstration ......

## Details

### Context

- Pokémon Pokédex Data (trimmed to first 20 Pokémon).
- Taken from: <https://github.com/Purukitto/pokemon-data.json/blob/master/pokedex.json>
- Copyrighted by the Pokémon Company and its affiliates.
- Data collected from [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page) and [pokemondb.net](https://pokemondb.net/)

Table item attributes:

```ts
id: number // (Partition key)
exists: boolean
name: {
  english: string
  japanese: string
  chinese: string
  french: string
}
type: Array<string>
base: {
  HP: number
  Attack: number
  Defense: number
  "Sp. Attack": number
  "Sp. Defense": number
  Speed: number
}
species: string
description: string
evolution: {
  next?: Array<Array<string>>
  prev?: Array<string>
}
profile: {
  height: string
  weight: string
  egg: Array<string>
  ability: Array<Array<string>>
  gender: string
}
image: {
  sprite: string
  thumbnail: string
  hires: string
}
```

### App API endpoints

- GET `/pokemon` - Get all Pokémon.
- POST `/pokemon` - Add a new Pokémon.
- PUT `/pokemon` - Update a Pokémon (using the pokemonId in the body).
- GET `/pokemon?descriptionContains={string}` - Get all Pokémon with a description that contains the passed string.
- GET `/pokemon/{id}` - Get a Pokémon by ID.
- GET `/pokemon/{id}/translation?language={string}` - Get a Pokémon with their description translated to the passed language string.

### Features

#### API Keys. (if completed)

<!-- [Explain briefly how to implement API key authentication to protect API Gateway endpoints. Include code excerpts from your app to support this.]

~~~ts
// This is a code excerpt markdown 
let foo : string = 'Foo'
console.log(foo)
~~~ -->
