import * as apig from "aws-cdk-lib/aws-apigateway";
import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as custom from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { generateBatch } from "../shared/util";
import { pokedex } from "../seed/pokedex";

export class PokedexRestAPIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pokedexTable = new dynamodb.Table(this, "PokedexTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "Pokedex",
    });

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
          REGION: "eu-west-1",
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
          REGION: "eu-west-1",
        },
      }
    );

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
          REGION: "eu-west-1",
        },
      }
    );

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

    // Permissions
    pokedexTable.grantReadData(getPokemonByIdFn);
    pokedexTable.grantReadData(getTranslatedPokemonByIdFn);
    // https://github.com/cdk-patterns/serverless/blob/08e31630e738f1b463c640cad1de6ca73d85f1c2/polly/typescript/lib/polly-stack.ts#L20-L27
    getTranslatedPokemonByIdFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["translate:TranslateText"],
        resources: ["*"],
      })
    );
    pokedexTable.grantReadData(getAllPokemonFn);
    pokedexTable.grantReadWriteData(addPokemonFn);

    // REST API
    const api = new apig.RestApi(this, "PokedexRestAPI", {
      description: "Pokedex API",
      deployOptions: {
        stageName: "dev",
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date", "X-API-Key"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
      apiKeySourceType: apig.ApiKeySourceType.HEADER,
    });

    const apiKey = new apig.ApiKey(this, "PokedexApiKey");
    const usagePlan = new apig.UsagePlan(this, "PokedexUsagePlan", {
      name: "Pokedex Usage Plan",
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
    });
    usagePlan.addApiKey(apiKey);

    // Pokemon endpoint
    const pokemonEndpoint = api.root.addResource("pokemon");
    pokemonEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getAllPokemonFn, { proxy: true })
    );
    pokemonEndpoint.addMethod(
      "POST",
      new apig.LambdaIntegration(addPokemonFn, { proxy: true }),
      { apiKeyRequired: true }
    );
    pokemonEndpoint.addMethod(
      "PUT",
      new apig.LambdaIntegration(addPokemonFn, { proxy: true }),
      { apiKeyRequired: true }
    );

    const specificPokemonEndpoint = pokemonEndpoint.addResource("{pokemonId}");
    specificPokemonEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getPokemonByIdFn, { proxy: true })
    );

    const translatedPokemonByIdEndpoint =
      specificPokemonEndpoint.addResource("translation");
    translatedPokemonByIdEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getTranslatedPokemonByIdFn, { proxy: true })
    );

    // You need to get the value from AWS for security reasons
    new cdk.CfnOutput(this, "Pokedex API Key ID", {
      value: apiKey.keyId,
    });
  }
}
