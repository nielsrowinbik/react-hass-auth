# react-hass-auth

> Home Assistant authentication + React Hooks, with Typescript

[![NPM](https://img.shields.io/npm/v/react-hass-auth.svg)](https://www.npmjs.com/package/react-hass-auth)

Easily add Home Assistant authentication to your React application. This is a thin wrapper over the [home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket) library for easily accessing its authentication functionality in your app, with React Context and Hooks. Types are provided.

## Typescript

Library is written in TypeScript. File an issue if you find any problems.

## Install

```bash
yarn add react-hass-auth
```

## Usage

When you call `useHassAuth()`, you can destructure these variables and methods:

-   `authed: boolean | undefined`: if the user is logged in, undefined while loading
-   `connection: Connection | undefined`: the `home-assistant-js-websocket` connection object once established
-   `loading: boolean`: if we are determining auth state
-   `login(hassUrl?: string)`: function to authenticate against provided Home Assistant instance URL (optional if provided through `HassAuthContextProvider`)
-   `logout()`: logs the user out
-   `_hassUrl: string | undefined`: the hassUrl used in login method

```tsx
import React from 'react';

import { HassAuthContextProvider } from 'react-hass-auth';

const App = () => {
    const url = 'http://hassio.local:8123'; // Supply the url of your Home Assistant instance. If left out, you are required to specify it when calling login.

    return (
        <HassAuthContextProvider hassUrl={url}>
            {/* rest of your app */}
        </HassAuthContextProvider>
    );
};
```

## License

MIT © [nielsrowinbik](https://github.com/nielsrowinbik)
