# nge-logging

## Overview

`nge-logging` is a simple Angular library that centralizes the configuration and management of logging in an application base on [Lumberjack](https://ngworker.github.io/lumberjack/). It provides a common place to handle logging setup, making it easy to customize and extend in the future, such as integrating HTTP logging or other logging mechanisms.

## Installation

To install the library, run the following command:

```sh
npm install @your-org/nge-logging
```

## Usage

Import and use the `provideLogging` function in your Angular application's root module or configuration:

```typescript
import { provideLogging } from '@ecoma/nge-logging';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideLogging()
    ...
  ],
};

```

Read more about [Lumberjack Usage Document](https://ngworker.github.io/lumberjack/docs/usage)

## Classes

- [LoggerService](/api/nge-logging/Class.LoggerService.md)

## Variables

- [LOGGER\_SCOPE](/api/nge-logging/Variable.LOGGER_SCOPE.md)
- [PINO\_LOGGER](/api/nge-logging/Variable.PINO_LOGGER.md)

## Functions

- [provideLoggerScope](/api/nge-logging/Function.provideLoggerScope.md)
