import React, {
    createContext,
    ReactNode,
    SFC,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    Auth,
    AuthData,
    Connection,
    createConnection,
    ERR_CANNOT_CONNECT,
    ERR_INVALID_AUTH,
    ERR_CONNECTION_LOST,
    getAuth,
} from 'home-assistant-js-websocket';

interface HassAuth {
    authed: boolean | undefined;
    connection: Connection | undefined;
    loading: boolean;
    login: (hassUrl: string) => Promise<Auth>;
    logout: () => void;
    _hassUrl: string | undefined;
}

interface HassAuthContextProviderProps {
    children: ReactNode;
    hassUrl?: string;
}

const [_useHassAuthContext, _HassAuthCtxProvider] = createCtx<HassAuth>();

export const useHassAuth = _useHassAuthContext;

export const HassAuthContextProvider: SFC<HassAuthContextProviderProps> = ({
    children,
    hassUrl,
}: {
    children: ReactNode;
    hassUrl?: string;
}) => {
    const auth = _useHassAuth(hassUrl);
    return <_HassAuthCtxProvider value={auth}>{children}</_HassAuthCtxProvider>;
};

const _useHassAuth = (hassUrl?: string): HassAuth => {
    const [authed, setAuthed] = useState<boolean | undefined>(undefined);
    const [connection, setConnection] = useState<Connection | undefined>(
        undefined
    );
    const [_hassUrl, setHassUrl] = useState(hassUrl);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authenticate = async () => {
            try {
                const auth = await getAuth({ loadTokens, saveTokens });
                const connection = await createConnection({ auth });
                setHassUrl(auth.data.hassUrl);
                setConnection(connection);
                setAuthed(true);
            } catch (error) {
                switch (error) {
                    case ERR_CANNOT_CONNECT:
                        console.error(
                            'Unable to connect to the provided Home Assistant host'
                        );
                    case ERR_INVALID_AUTH:
                        console.error('The provided authentication is invalid');
                    case ERR_CONNECTION_LOST:
                        console.error(
                            'Connection to the Home Assistant host was lost'
                        );
                }
                setAuthed(false);
            } finally {
                setLoading(false);
            }
        };

        authenticate();
    }, []);

    /*
     *
     * OPERATIONS
     *
     */

    const login = async (hassUrl: string) => getAuth({ hassUrl });

    const logout = removeTokens;

    return {
        authed,
        connection,
        loading,
        login,
        logout,
        _hassUrl,
    };
};

/*
 *
 * UTILITY
 *
 */

function createCtx<A>() {
    const ctx = createContext<A | undefined>(undefined);
    const useCtx = () => {
        const c = useContext(ctx);
        if (!c)
            throw new Error('useCtx must be inside a Provider with a value');
        return c;
    };
    return [useCtx, ctx.Provider] as const;
}

const saveTokens = (authData: AuthData | null) =>
    localStorage.setItem('authData', JSON.stringify(authData));

const loadTokens = async () => {
    const stringified = localStorage.getItem('authData');

    if (stringified === null) return undefined;

    const parsed: AuthData = JSON.parse(stringified);
    return parsed;
};

const removeTokens = () => localStorage.removeItem('authData');
