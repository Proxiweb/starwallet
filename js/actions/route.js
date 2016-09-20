export const PUSH_NEW_ROUTE = 'PUSH_NEW_ROUTE';
export const REPLACE_ROUTE = 'REPLACE_ROUTE';
export const REPLACE_OR_PUSH_ROUTE = 'REPLACE_OR_PUSH_ROUTE';
export const POP_ROUTE = 'POP_ROUTE';
export const POP_TO_ROUTE = 'POP_TO_ROUTE';

export function replaceRoute(route, passProps) {
    return {
        type: REPLACE_ROUTE,
        route,
        passProps,
    };
}

export function pushNewRoute(route, passProps) {
    return {
        type: PUSH_NEW_ROUTE,
        route,
        passProps,
    };
}

export function replaceOrPushRoute(route, passProps) {
    return {
        type: REPLACE_OR_PUSH_ROUTE,
        route,
        passProps,
    };
}

export function popRoute(passProps) {
    return {
        type: POP_ROUTE,
        passProps,
    };
}

export function popToRoute(route, passProps) {
    return {
        type: POP_TO_ROUTE,
        route,
        passProps,
    };
}
