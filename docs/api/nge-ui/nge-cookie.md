# Cookies Service for Angular (CSR & SSR)

This library provides a robust way to manage cookies in **Angular applications**, supporting both **Client-Side Rendering (CSR)** and **Server-Side Rendering (SSR)**.

## Features

✅ Read, write, and delete cookies effortlessly  
✅ Supports both **browser (CSR)** and **server-side rendering (SSR)**  
✅ Secure cookie handling with `SameSite`, `Secure`, `Partitioned` options  
✅ Get all cookies as a JSON object  
✅ TypeScript support

---

## Installation

Install the package using npm:

```sh
npm install @ecoma/ecng-cookies
```

or using yarn:

```sh
yarn add @ecoma/ecng-cookies
```

---

## Usage

### Import & Inject the Service

#### In an Angular Component/Service:

```ts
import { Cookies } from "@ecoma/ecng-cookies";
import { Component } from "@angular/core";

@Component({
  selector: "app-example",
  templateUrl: "./example.component.html",
})
export class ExampleComponent {
  constructor(private cookies: Cookies) {}

  setCookie() {
    this.cookies.set("user", "ecomaUser", { expires: 7, path: "/" });
  }

  getCookie() {
    console.log(this.cookies.get("user"));
  }

  deleteCookie() {
    this.cookies.delete("user");
  }
}
```

---

## Usage in SSR (Server-Side Rendering)

To use this service in **SSR**, ensure you provide `REQUEST` and `RESPONSE` objects in your `server.ts`:

```ts
{ provide: 'REQUEST', useValue: req },
{ provide: 'RESPONSE', useValue: res },
```

### Example in `server.ts`

```ts
server.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    const { host } = headers;
    commonEngine
      .render({
        bootstrap,
        inlineCriticalCss: false,
        documentFilePath: indexHtml,
        url: `${protocol}://${host}${originalUrl}`,
        publicPath: distFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: 'REQUEST', useValue: req },
          { provide: 'RESPONSE', useValue: res },
          ...
        ],
      })
      .then((html: string) => res.send(html))
      .catch((err: unknown) => next(err));
  });
```

---

## API Methods

### `set(name: string, value: string, options?: CookieOptions): void`

Sets a cookie with optional parameters.

```ts
cookies.set("session", "abcd1234", { expires: 3, path: "/", secure: true });
```

#### Options:

| Option        | Type                          | Default | Description                           |
| ------------- | ----------------------------- | ------- | ------------------------------------- |
| `expires`     | `number \| Date`              | -       | Expiration time (days) or Date object |
| `path`        | `string`                      | -       | Cookie path                           |
| `domain`      | `string`                      | -       | Cookie domain                         |
| `secure`      | `boolean`                     | `false` | Secure flag                           |
| `sameSite`    | `'Lax' \| 'None' \| 'Strict'` | `'Lax'` | SameSite attribute                    |
| `partitioned` | `boolean`                     | `false` | Partitioned flag                      |

---

### `get(name: string): string`

Retrieves the value of a cookie.

```ts
const user = cookies.get("user");
```

---

### `getAll(): { [key: string]: string }`

Retrieves all cookies as a JSON object.

```ts
const allCookies = cookies.getAll();
```

---

### `check(name: string): boolean`

Checks if a cookie exists.

```ts
if (cookies.check("session")) {
  console.log("Session cookie exists");
}
```

---

### `delete(name: string, path?: string, domain?: string, secure?: boolean, sameSite?: 'Lax' | 'None' | 'Strict'): void`

Deletes a specific cookie.

```ts
cookies.delete("user");
```

---

### `deleteAll(path?: string, domain?: string, secure?: boolean, sameSite?: 'Lax' | 'None' | 'Strict'): void`

Deletes all cookies.

```ts
cookies.deleteAll();
```

## Classes

- [Cookies](/api/nge-cookie/Class.Cookies.md)
