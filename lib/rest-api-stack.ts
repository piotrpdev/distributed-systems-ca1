import * as apig from "aws-cdk-lib/aws-apigateway";
import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as custom from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { generateBatch } from "../shared/util";
import { pokedex } from "../seed/pokedex";

export class PokedexRestAPIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Tables 
    // const moviesTable = new dynamodb.Table(this, "MoviesTable", {
    //   billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    //   partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   tableName: "Movies",
    // });
    const pokedexTable = new dynamodb.Table(this, "PokedexTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "Pokedex",
    });

    // const movieCastsTable = new dynamodb.Table(this, "MovieCastTable", {
    //   billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    //   partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
    //   sortKey: { name: "actorName", type: dynamodb.AttributeType.STRING },
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   tableName: "MovieCast",
    // });

    // movieCastsTable.addLocalSecondaryIndex({
    //   indexName: "roleIx",
    //   sortKey: { name: "roleName", type: dynamodb.AttributeType.STRING },
    // });
    
    // // Functions 
    // const getMovieByIdFn = new lambdanode.NodejsFunction(
    //   this,
    //   "GetMovieByIdFn",
    //   {
    //     architecture: lambda.Architecture.ARM_64,
    //     runtime: lambda.Runtime.NODEJS_18_X,
    //     entry: `${__dirname}/../lambdas/getMovieById.ts`,
    //     timeout: cdk.Duration.seconds(10),
    //     memorySize: 128,
    //     environment: {
    //       TABLE_NAME: moviesTable.tableName,
    //       REGION: 'eu-west-1',
    //     },
    //   }
    //   );
    const getPokemonByIdFn = new lambdanode.NodejsFunction(
      this,
      "GetPokemonByIdFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${__dirname}/../lambdas/getPokemonById.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: pokedexTable.tableName,
          REGION: 'eu-west-1',
        },
      }
    );

    const getTranslatedPokemonByIdFn = new lambdanode.NodejsFunction(
      this,
      "getTranslatedPokemonByIdFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${__dirname}/../lambdas/getTranslatedPokemonById.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: pokedexTable.tableName,
          REGION: 'eu-west-1',
        },
      }
    );
      
    //   const getAllMoviesFn = new lambdanode.NodejsFunction(
    //     this,
    //     "GetAllMoviesFn",
    //     {
    //       architecture: lambda.Architecture.ARM_64,
    //       runtime: lambda.Runtime.NODEJS_18_X,
    //       entry: `${__dirname}/../lambdas/getAllMovies.ts`,
    //       timeout: cdk.Duration.seconds(10),
    //       memorySize: 128,
    //       environment: {
    //         TABLE_NAME: moviesTable.tableName,
    //         REGION: 'eu-west-1',
    //       },
    //     }
    //     );
    const getAllPokemonFn = new lambdanode.NodejsFunction(
      this,
      "GetAllPokemonFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${__dirname}/../lambdas/getAllPokemon.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: pokedexTable.tableName,
          REGION: 'eu-west-1',
        },
      }
    );
      
    //     const newMovieFn = new lambdanode.NodejsFunction(this, "AddMovieFn", {
    //       architecture: lambda.Architecture.ARM_64,
    //       runtime: lambda.Runtime.NODEJS_22_X,
    //       entry: `${__dirname}/../lambdas/addMovie.ts`,
    //       timeout: cdk.Duration.seconds(10),
    //       memorySize: 128,
    //       environment: {
    //         TABLE_NAME: moviesTable.tableName,
    //         REGION: "eu-west-1",
    //       },
    //     });
    const addPokemonFn = new lambdanode.NodejsFunction(this, "AddPokemonFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: `${__dirname}/../lambdas/addPokemon.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: pokedexTable.tableName,
        REGION: "eu-west-1",
      },
    });

    //     const deleteMovieFn = new lambdanode.NodejsFunction(this, "DeleteMovieFn", {
    //       architecture: lambda.Architecture.ARM_64,
    //       runtime: lambda.Runtime.NODEJS_22_X,
    //       entry: `${__dirname}/../lambdas/deleteMovie.ts`,
    //       timeout: cdk.Duration.seconds(10),
    //       memorySize: 128,
    //       environment: {
    //         TABLE_NAME: moviesTable.tableName,
    //         REGION: "eu-west-1",
    //       },
    //     });

    //     const getMovieCastMembersFn = new lambdanode.NodejsFunction(
    //       this,
    //       "GetCastMemberFn",
    //       {
    //         architecture: lambda.Architecture.ARM_64,
    //         runtime: lambda.Runtime.NODEJS_22_X,
    //         entry: `${__dirname}/../lambdas/getMovieCastMember.ts`,
    //         timeout: cdk.Duration.seconds(10),
    //         memorySize: 128,
    //         environment: {
    //           TABLE_NAME: movieCastsTable.tableName,
    //           REGION: "eu-west-1",
    //         },
    //       }
    //     );
        
    //     new custom.AwsCustomResource(this, "moviesddbInitData", {
    //       onCreate: {
    //         service: "DynamoDB",
    //         action: "batchWriteItem",
    //         parameters: {
    //           RequestItems: {
    //             [moviesTable.tableName]: generateBatch(movies),
    //             [movieCastsTable.tableName]: generateBatch(movieCasts),  // Added
    //           },
    //         },
    //         physicalResourceId: custom.PhysicalResourceId.of("moviesddbInitData"), //.of(Date.now().toString()),
    //       },
    //       policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
    //         resources: [moviesTable.tableArn, movieCastsTable.tableArn],  // Includes movie cast
    //       }),
    //     });
    new custom.AwsCustomResource(this, "pokedexDbInitData", {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            [pokedexTable.tableName]: generateBatch(pokedex),
          },
        },
        physicalResourceId: custom.PhysicalResourceId.of("pokedexDbInitData"), //.of(Date.now().toString()),
      },
      policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [pokedexTable.tableArn],
      }),
    });
        
    //     // Permissions 
    //     moviesTable.grantReadData(getMovieByIdFn)
    pokedexTable.grantReadData(getPokemonByIdFn);
    pokedexTable.grantReadData(getTranslatedPokemonByIdFn);
    // https://github.com/cdk-patterns/serverless/blob/08e31630e738f1b463c640cad1de6ca73d85f1c2/polly/typescript/lib/polly-stack.ts#L20-L27
    getTranslatedPokemonByIdFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["translate:TranslateText"],
        resources: ["*"],
      })
    );
    //     moviesTable.grantReadData(getAllMoviesFn)
    pokedexTable.grantReadData(getAllPokemonFn);
    //     moviesTable.grantReadWriteData(newMovieFn)
    pokedexTable.grantReadWriteData(addPokemonFn);
    //     moviesTable.grantReadWriteData(deleteMovieFn)
    //     movieCastsTable.grantReadData(getMovieCastMembersFn);
    //     movieCastsTable.grantReadData(getMovieByIdFn);
        
    // REST API 
    //     const api = new apig.RestApi(this, "RestAPI", {
    //       description: "demo api",
    //       deployOptions: {
    //         stageName: "dev",
    //       },
    //       defaultCorsPreflightOptions: {
    //         allowHeaders: ["Content-Type", "X-Amz-Date"],
    //         allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
    //         allowCredentials: true,
    //         allowOrigins: ["*"],
    //       },
    //     });
    const api = new apig.RestApi(this, "PokedexRestAPI", {
      description: "Pokedex API",
      deployOptions: {
        stageName: "dev",
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    // Pokemon endpoint
    const pokemonEndpoint = api.root.addResource("pokemon");
    pokemonEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getAllPokemonFn, { proxy: true })
    );
    pokemonEndpoint.addMethod(
      "POST",
      new apig.LambdaIntegration(addPokemonFn, { proxy: true })
    );
    pokemonEndpoint.addMethod(
      "PUT",
      new apig.LambdaIntegration(addPokemonFn, { proxy: true })
    );

    const specificPokemonEndpoint = pokemonEndpoint.addResource("{pokemonId}");
    specificPokemonEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getPokemonByIdFn, { proxy: true })
    );

    const translatedPokemonByIdEndpoint = specificPokemonEndpoint.addResource("translation");
    translatedPokemonByIdEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getTranslatedPokemonByIdFn, { proxy: true })
    );

    //     // Movies endpoint
    //     const moviesEndpoint = api.root.addResource("movies");
    //     moviesEndpoint.addMethod(
    //       "GET",
    //       new apig.LambdaIntegration(getAllMoviesFn, { proxy: true })
    //     );
    //     moviesEndpoint.addMethod(
    //       "POST",
    //       new apig.LambdaIntegration(newMovieFn, { proxy: true })
    //     );
    //     // Detail movie endpoint
    //     const specificMovieEndpoint = moviesEndpoint.addResource("{movieId}");
    //     specificMovieEndpoint.addMethod(
    //       "GET",
    //       new apig.LambdaIntegration(getMovieByIdFn, { proxy: true })
    //     );
    //     specificMovieEndpoint.addMethod(
    //       "DELETE",
    //       new apig.LambdaIntegration(deleteMovieFn, { proxy: true })
    //     );

    //     const movieCastEndpoint = moviesEndpoint.addResource("cast");

    //     movieCastEndpoint.addMethod(
    //         "GET",
    //         new apig.LambdaIntegration(getMovieCastMembersFn, { proxy: true })
    //     );
      }
    }
    