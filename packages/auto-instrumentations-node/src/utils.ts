/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { diag } from '@opentelemetry/api';
import { Instrumentation } from '@opentelemetry/instrumentation';

import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { AwsLambdaInstrumentation } from '@opentelemetry/instrumentation-aws-lambda';
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk';
import { BunyanInstrumentation } from '@opentelemetry/instrumentation-bunyan';
import { CassandraDriverInstrumentation } from '@opentelemetry/instrumentation-cassandra-driver';
import { ConnectInstrumentation } from '@opentelemetry/instrumentation-connect';
import { CucumberInstrumentation } from '@opentelemetry/instrumentation-cucumber';
import { DataloaderInstrumentation } from '@opentelemetry/instrumentation-dataloader';
import { DnsInstrumentation } from '@opentelemetry/instrumentation-dns';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { FsInstrumentation } from '@opentelemetry/instrumentation-fs';
import { GenericPoolInstrumentation } from '@opentelemetry/instrumentation-generic-pool';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { HapiInstrumentation } from '@opentelemetry/instrumentation-hapi';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { KafkaJsInstrumentation } from '@opentelemetry/instrumentation-kafkajs';
import { KnexInstrumentation } from '@opentelemetry/instrumentation-knex';
import { KoaInstrumentation } from '@opentelemetry/instrumentation-koa';
import { LruMemoizerInstrumentation } from '@opentelemetry/instrumentation-lru-memoizer';
import { MemcachedInstrumentation } from '@opentelemetry/instrumentation-memcached';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';
import { MongooseInstrumentation } from '@opentelemetry/instrumentation-mongoose';
import { MySQL2Instrumentation } from '@opentelemetry/instrumentation-mysql2';
import { MySQLInstrumentation } from '@opentelemetry/instrumentation-mysql';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { NetInstrumentation } from '@opentelemetry/instrumentation-net';
import { OracleInstrumentation } from '@opentelemetry/instrumentation-oracledb';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { RestifyInstrumentation } from '@opentelemetry/instrumentation-restify';
import { RouterInstrumentation } from '@opentelemetry/instrumentation-router';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';
import { SocketIoInstrumentation } from '@opentelemetry/instrumentation-socket.io';
import { TediousInstrumentation } from '@opentelemetry/instrumentation-tedious';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';

import { alibabaCloudEcsDetector } from '@opentelemetry/resource-detector-alibaba-cloud';
import {
  awsBeanstalkDetector,
  awsEc2Detector,
  awsEcsDetector,
  awsEksDetector,
  awsLambdaDetector,
} from '@opentelemetry/resource-detector-aws';
import { containerDetector } from '@opentelemetry/resource-detector-container';
import { gcpDetector } from '@opentelemetry/resource-detector-gcp';
import {
  ResourceDetector,
  envDetector,
  hostDetector,
  osDetector,
  processDetector,
  serviceInstanceIdDetector,
} from '@opentelemetry/resources';
import {
  azureAppServiceDetector,
  azureFunctionsDetector,
  azureVmDetector,
} from '@opentelemetry/resource-detector-azure';

const RESOURCE_DETECTOR_CONTAINER = 'container';
const RESOURCE_DETECTOR_ENVIRONMENT = 'env';
const RESOURCE_DETECTOR_HOST = 'host';
const RESOURCE_DETECTOR_OS = 'os';
const RESOURCE_DETECTOR_SERVICE_INSTANCE_ID = 'serviceinstance';
const RESOURCE_DETECTOR_PROCESS = 'process';
const RESOURCE_DETECTOR_ALIBABA = 'alibaba';
const RESOURCE_DETECTOR_AWS = 'aws';
const RESOURCE_DETECTOR_AZURE = 'azure';
const RESOURCE_DETECTOR_GCP = 'gcp';

const InstrumentationMap = {
  '@opentelemetry/instrumentation-amqplib': AmqplibInstrumentation,
  '@opentelemetry/instrumentation-aws-lambda': AwsLambdaInstrumentation,
  '@opentelemetry/instrumentation-aws-sdk': AwsInstrumentation,
  '@opentelemetry/instrumentation-bunyan': BunyanInstrumentation,
  '@opentelemetry/instrumentation-cassandra-driver':
    CassandraDriverInstrumentation,
  '@opentelemetry/instrumentation-connect': ConnectInstrumentation,
  '@opentelemetry/instrumentation-cucumber': CucumberInstrumentation,
  '@opentelemetry/instrumentation-dataloader': DataloaderInstrumentation,
  '@opentelemetry/instrumentation-dns': DnsInstrumentation,
  '@opentelemetry/instrumentation-express': ExpressInstrumentation,
  '@opentelemetry/instrumentation-fastify': FastifyInstrumentation,
  '@opentelemetry/instrumentation-fs': FsInstrumentation,
  '@opentelemetry/instrumentation-generic-pool': GenericPoolInstrumentation,
  '@opentelemetry/instrumentation-graphql': GraphQLInstrumentation,
  '@opentelemetry/instrumentation-grpc': GrpcInstrumentation,
  '@opentelemetry/instrumentation-hapi': HapiInstrumentation,
  '@opentelemetry/instrumentation-http': HttpInstrumentation,
  '@opentelemetry/instrumentation-ioredis': IORedisInstrumentation,
  '@opentelemetry/instrumentation-kafkajs': KafkaJsInstrumentation,
  '@opentelemetry/instrumentation-knex': KnexInstrumentation,
  '@opentelemetry/instrumentation-koa': KoaInstrumentation,
  '@opentelemetry/instrumentation-lru-memoizer': LruMemoizerInstrumentation,
  '@opentelemetry/instrumentation-memcached': MemcachedInstrumentation,
  '@opentelemetry/instrumentation-mongodb': MongoDBInstrumentation,
  '@opentelemetry/instrumentation-mongoose': MongooseInstrumentation,
  '@opentelemetry/instrumentation-mysql2': MySQL2Instrumentation,
  '@opentelemetry/instrumentation-mysql': MySQLInstrumentation,
  '@opentelemetry/instrumentation-nestjs-core': NestInstrumentation,
  '@opentelemetry/instrumentation-net': NetInstrumentation,
  '@opentelemetry/instrumentation-oracledb': OracleInstrumentation,
  '@opentelemetry/instrumentation-pg': PgInstrumentation,
  '@opentelemetry/instrumentation-pino': PinoInstrumentation,
  '@opentelemetry/instrumentation-redis': RedisInstrumentation,
  '@opentelemetry/instrumentation-restify': RestifyInstrumentation,
  '@opentelemetry/instrumentation-router': RouterInstrumentation,
  '@opentelemetry/instrumentation-runtime-node': RuntimeNodeInstrumentation,
  '@opentelemetry/instrumentation-socket.io': SocketIoInstrumentation,
  '@opentelemetry/instrumentation-tedious': TediousInstrumentation,
  '@opentelemetry/instrumentation-undici': UndiciInstrumentation,
  '@opentelemetry/instrumentation-winston': WinstonInstrumentation,
};

const defaultExcludedInstrumentations = [
  '@opentelemetry/instrumentation-fs',
  '@opentelemetry/instrumentation-fastify',
];

// Config types inferred automatically from the first argument of the constructor
type ConfigArg<T> = T extends new (...args: infer U) => unknown ? U[0] : never;
export type InstrumentationConfigMap = {
  [Name in keyof typeof InstrumentationMap]?: ConfigArg<
    (typeof InstrumentationMap)[Name]
  >;
};

export function getNodeAutoInstrumentations(
  inputConfigs: InstrumentationConfigMap = {}
): Instrumentation[] {
  checkManuallyProvidedInstrumentationNames(Object.keys(inputConfigs));
  const enabledInstrumentationsFromEnv = getEnabledInstrumentationsFromEnv();
  const disabledInstrumentationsFromEnv = getDisabledInstrumentationsFromEnv();

  const instrumentations: Instrumentation[] = [];

  for (const name of Object.keys(InstrumentationMap) as Array<
    keyof typeof InstrumentationMap
  >) {
    const Instance = InstrumentationMap[name];
    // Defaults are defined by the instrumentation itself
    const userConfig: any = inputConfigs[name] ?? {};

    if (
      userConfig.enabled === false ||
      !enabledInstrumentationsFromEnv.includes(name) ||
      disabledInstrumentationsFromEnv.includes(name)
    ) {
      diag.debug(`Disabling instrumentation for ${name}`);
      continue;
    }

    try {
      diag.debug(`Loading instrumentation for ${name}`);
      instrumentations.push(new Instance(userConfig));
    } catch (e: any) {
      diag.error(e);
    }
  }

  return instrumentations;
}

function checkManuallyProvidedInstrumentationNames(
  manuallyProvidedInstrumentationNames: string[]
) {
  for (const name of manuallyProvidedInstrumentationNames) {
    if (!Object.prototype.hasOwnProperty.call(InstrumentationMap, name)) {
      diag.error(`Provided instrumentation name "${name}" not found`);
    }
  }
}

function getInstrumentationsFromEnv(envVar: string): string[] {
  const envVarValue = process.env[envVar];
  if (envVarValue == null) {
    return [];
  }

  const instrumentationsFromEnv = envVarValue
    ?.split(',')
    .map(
      instrumentationPkgSuffix =>
        `@opentelemetry/instrumentation-${instrumentationPkgSuffix.trim()}`
    );
  checkManuallyProvidedInstrumentationNames(instrumentationsFromEnv);
  return instrumentationsFromEnv;
}

/**
 * Returns the list of instrumentations that are enabled based on the environment variable.
 * If the environment variable is unset, returns all instrumentation that are enabled by default.
 */
function getEnabledInstrumentationsFromEnv() {
  if (!process.env.OTEL_NODE_ENABLED_INSTRUMENTATIONS) {
    // all keys in the InstrumentationMap except for everything that is not enabled by default.
    return Object.keys(InstrumentationMap).filter(
      key => !defaultExcludedInstrumentations.includes(key)
    );
  }

  const instrumentationsFromEnv = getInstrumentationsFromEnv(
    'OTEL_NODE_ENABLED_INSTRUMENTATIONS'
  );
  return instrumentationsFromEnv;
}

/**
 * Returns the list of instrumentations that are disabled based on the environment variable.
 */
function getDisabledInstrumentationsFromEnv() {
  if (!process.env.OTEL_NODE_DISABLED_INSTRUMENTATIONS) {
    return [];
  }

  const instrumentationsFromEnv = getInstrumentationsFromEnv(
    'OTEL_NODE_DISABLED_INSTRUMENTATIONS'
  );
  return instrumentationsFromEnv;
}

export function getResourceDetectorsFromEnv(): Array<ResourceDetector> {
  const resourceDetectors = new Map<
    string,
    ResourceDetector | ResourceDetector[]
  >([
    [RESOURCE_DETECTOR_CONTAINER, containerDetector],
    [RESOURCE_DETECTOR_ENVIRONMENT, envDetector],
    [RESOURCE_DETECTOR_HOST, hostDetector],
    [RESOURCE_DETECTOR_OS, osDetector],
    [RESOURCE_DETECTOR_SERVICE_INSTANCE_ID, serviceInstanceIdDetector],
    [RESOURCE_DETECTOR_PROCESS, processDetector],
    [RESOURCE_DETECTOR_ALIBABA, alibabaCloudEcsDetector],
    [RESOURCE_DETECTOR_GCP, gcpDetector],
    [
      RESOURCE_DETECTOR_AWS,
      [
        awsEc2Detector,
        awsEcsDetector,
        awsEksDetector,
        awsBeanstalkDetector,
        awsLambdaDetector,
      ],
    ],
    [
      RESOURCE_DETECTOR_AZURE,
      [azureAppServiceDetector, azureFunctionsDetector, azureVmDetector],
    ],
  ]);

  const resourceDetectorsFromEnv =
    process.env.OTEL_NODE_RESOURCE_DETECTORS?.split(',') ?? ['all'];

  if (resourceDetectorsFromEnv.includes('all')) {
    return [...resourceDetectors.values()].flat();
  }

  if (resourceDetectorsFromEnv.includes('none')) {
    return [];
  }

  return resourceDetectorsFromEnv.flatMap(detector => {
    const resourceDetector = resourceDetectors.get(detector);
    if (!resourceDetector) {
      diag.error(
        `Invalid resource detector "${detector}" specified in the environment variable OTEL_NODE_RESOURCE_DETECTORS`
      );
    }
    return resourceDetector || [];
  });
}
