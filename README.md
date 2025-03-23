# Serverless REST Assignment - Distributed Systems

__Name:__ Piotr Placzek (20097618)

__Demo:__ <https://youtu.be/blACcH1mZqQ>

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

#### API Keys

Modify code like this:

```ts
// Specify API key source for the API Gateway
const api = new apig.RestApi(this, "PokedexRestAPI", {
  defaultCorsPreflightOptions: {
    allowHeaders: [..., "X-API-Key"],
    allowCredentials: true,
    ...
  },
  apiKeySourceType: apig.ApiKeySourceType.HEADER,
});

// Create API key and usage plan (needed for API key to work)
const apiKey = new apig.ApiKey(this, "PokedexApiKey");
const usagePlan = new apig.UsagePlan(this, "PokedexUsagePlan", {
  name: "Pokedex Usage Plan",
  apiStages: [
    {
      api,
      stage: api.deploymentStage, // Default stage e.g. dev/prod
    },
  ],
});
// Add the API key to the usage plan
usagePlan.addApiKey(apiKey);

// Specify API key is required for the endpoint(s)
pokemonEndpoint.addMethod(
  "POST",
  new apig.LambdaIntegration(addPokemonFn, { proxy: true }),
  { apiKeyRequired: true }
);
```

Navigate to `Pokedex CDK Stack -> API Gateway -> API keys -> (API key) -> Show API Key`.
