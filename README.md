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

<!-- [ Provide a bullet-point list of the app's endpoints (excluding the Auth API) you have successfully implemented. ]
e.g.

+ POST /thing - add a new 'thing'.
+ GET /thing/{partition-key}/ - Get all the 'things' with a specified partition key.
+ GEtT/thing/{partition-key}?attributeX=value - Get all the 'things' with a specified partition key value and its attributeX satisfying the condition .....
+ etc -->

- GET `/pokemon` - Get all Pokémon.
- POST `/pokemon` - Add a new Pokémon.
- PUT `/pokemon` - Update a Pokémon (using the pokemonId in the body).
- GET `/pokemon?descriptionContains={string}` - Get all Pokémon with a description that contains the passed string.
- GET `/pokemon/{id}` - Get a Pokémon by ID.
- GET `/pokemon/{id}/translation?language={string}` - Get a Pokémon with their description translated to the passed language string.

### Features

#### Translation persistence (if completed)

<!-- [ Explain briefly your solution to the translation persistence requirement - no code excerpts required. Show the structure of a table item that includes review translations, e.g.

+ MovieID - `number`  (Partition key)
+ ActorID - `number`  (Sort Key)
+ RoleName - `string`
+ RoleDescription - `string`
+ AwardsWon - `List<string>`
+ Translations - `?`
] -->

#### Custom L2 Construct (if completed)

<!-- [State briefly the infrastructure provisioned by your custom L2 construct. Show the structure of its input props object and list the public properties it exposes, e.g. taken from the Cognito lab,

Construct Input props object:

~~~ts
type AuthApiProps = {
 userPoolId: string;
 userPoolClientId: string;
}
~~~

Construct public properties

~~~ts
export class MyConstruct extends Construct {
 public  PropertyName: type
 etc.
~~~

] -->

#### Multi-Stack app (if completed)

<!-- [Explain briefly the stack composition of your app - no code excerpts required.] -->

#### Lambda Layers (if completed)

<!-- [Explain briefly where you used the Layers feature of the AWS Lambda service - no code excerpts required.] -->

#### API Keys. (if completed)

<!-- [Explain briefly how to implement API key authentication to protect API Gateway endpoints. Include code excerpts from your app to support this.]

~~~ts
// This is a code excerpt markdown 
let foo : string = 'Foo'
console.log(foo)
~~~ -->

### Extra (If relevant)

<!-- [ State any other aspects of your solution that use CDK/serverless features not covered in the lectures ] -->
