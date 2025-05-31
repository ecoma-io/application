# nge-redirect

A library to handle external redirects in Angular applications, supporting both client-side and server-side rendering (SSR).

## Installation

```bash
npm install @ecoma/nge-redirect
# or yarn add @ecoma/nge-redirect
# or pnpm add @ecoma/nge-redirect
```

## Usage

### Providing the Express Response (for SSR)

If you are using Angular Universal or another SSR solution with Express, you need to provide the Express `Response` object to the `Redirector` service. You can do this in your server-side application's main file (e.g., `server.ts`) using the `provideSsrRedirector` function:

```typescript
import { provideSsrRedirector } from '@ecoma/nge-redirect';

// ... other imports

const server = express();

server.get('*', (req, res) => {
  // ... other SSR setup

  ngExpressEngine({
    // ...
    providers: [
      // ... other providers
      provideSsrRedirector(res),
    ],
  })(req, res);
});

// ... start server
```

### Using the Redirector Service

Inject the `Redirector` service into your component or service and use the `redirectToExternalWebsite` method:

```typescript
import { Component } from '@angular/core';
import { Redirector } from '@ecoma/nge-redirect';

@Component({
  selector: 'app-my-component',
  template: '<button (click)="redirect()">Redirect</button>',
})
export class MyComponent {
  constructor(private redirector: Redirector) {}

  redirect() {
    this.redirector.redirectToExternalWebsite('https://www.example.com');
  }
}
```

This will handle the redirect appropriately based on whether the application is running in the browser or on the server.
