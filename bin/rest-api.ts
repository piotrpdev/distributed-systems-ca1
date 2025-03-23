#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PokedexRestAPIStack } from "../lib/rest-api-stack";

const app = new cdk.App();
new PokedexRestAPIStack(app, "PokedexRestAPIStack", { env: { region: "eu-west-1" } });
