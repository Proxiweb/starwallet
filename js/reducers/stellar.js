import update from 'react-addons-update';

import {
    LOAD_USER_ACCOUNT_ERROR,
    LOAD_USER_ACCOUNT_SUCCESS,
    LOAD_USER_ACCOUNT,
    LOAD_PAYMENTS,
    LOAD_PAYMENTS_SUCCESS,
    LOAD_CONTACTS_SUCCESS,
    PAY,
    PAY_SUCCESS,
    PAY_ERROR,
    TRUST,
    FEDERATION,
    FEDERATION_SUCCESS,
    FEDERATION_ERROR,
    SET_ERROR,
    STORE_STELLAR_KEYS_SUCCESS,
    STORE_STELLAR_KEYS_ERROR,
    LOAD_STELLAR_KEYS_SUCCESS,
    LOAD_STELLAR_KEYS_ERROR,
    REMOVE_STELLAR_KEYS_SUCCESS,
    REMOVE_STELLAR_KEYS_ERROR,
    TOGGLE_MODE_SUCCESS,
    SELECT_ACCOUNT,
    CLEAR_ERROR,
    CHANGE_ENV,
} from '../actions/stellar';


const initialState = {
    env: 'public', // test || public
    mode: 'basic', // basic || advanced

    balances: null,
    sequence: null,
    payments: null,
    issuers: null,

    stellarKeys: null,
    pending: false,
    error: null,

    contacts: null,
    asyncStorageLoaded: false,
    drawerState: 'closed',
    routes: ['login'],
};

const syncContact = (state, action) => {
    const { accountId, fedId } = action.payload;
    if (state.contacts.find(contact => contact.accountId === accountId || (fedId !== null && contact.fedId === fedId))) {
        return update(state, { pending: { $set: false }, error: { $set: null }, scope: { $set: action.type.split('/')[1].toLowerCase() } });
    }
    return update(
        state,
        {
            contacts: { $push: [{ accountId, fedId, nom: fedId }] },
            pending: { $set: false },
            error: { $set: null },
            scope: { $set: action.type.split('/')[1].toLowerCase() },
        },
    );
};

const _selectAccount = (state, name) => {
    const stellarKeys = { ...state.stellarKeys };
    const env = state.env;

    const newStellarKeys = {};
    Object.keys(stellarKeys[state.env]).forEach(accountName => {
        newStellarKeys[accountName] = {
            ...stellarKeys[state.env][accountName],
            active: accountName === name,
        };
    });

    return update(state, { stellarKeys: { [env]: { $set: newStellarKeys } } });
};

// const updateAccount = (state, asset, amount) => {
//     const idx = findIndex(state.balances, bal => (asset === 'XLM' && bal.asset_type === 'native') || (asset !== 'XLM' && asset === bal.asset_code));
//     return update(state, { balances: { [idx]: { $set: amount } } });
// };

const stellarReducer = (state = initialState, action) => {
    switch (action.type) {
    case LOAD_PAYMENTS:
        return {
            ...state,
            payments: null,
        };
    case TRUST:
    case FEDERATION:
    case PAY:
    case LOAD_USER_ACCOUNT:
        return {
            ...state,
            pending: true,
            balances: null,
            sequence: null,
            issuers: null,
        };
    case LOAD_USER_ACCOUNT_SUCCESS: {
        const { balances, sequence } = action.payload.account;
        return { ...state, balances, sequence, scope: action.type.split('/')[1].toLowerCase() };
    }
    case LOAD_USER_ACCOUNT_ERROR:
        return {
            ...state,
            error: action.payload.err,
            pending: false,
            balances: null,
            sequence: null,
            payments: null,
            issuers: null,
        };

    case LOAD_PAYMENTS_SUCCESS: {
        const { payments } = action.payload;
        return { ...state, payments, pending: false };
    }
    case FEDERATION_SUCCESS:
        return syncContact(state, action);
    case FEDERATION_ERROR:
        return { ...state, error: 'Adresse non trouvée', pending: false };
    case PAY_ERROR:
        return { ...state, error: 'Erreur lors du paiement', pending: false };
    case PAY_SUCCESS:
        return { ...state, pending: false, scope: 'pay_success' };
    case SET_ERROR:
        return { ...state, error: action.payload.error, pending: false };
    case CLEAR_ERROR:
        return { ...state, error: null, pending: false };

    case STORE_STELLAR_KEYS_SUCCESS:
        return update(state, { stellarKeys: { $set: action.payload.stellarKeys } });


    case LOAD_STELLAR_KEYS_SUCCESS:
        return { ...state, stellarKeys: action.payload.stellarKeys, balances: null, payments: null }; // all envs
    case REMOVE_STELLAR_KEYS_SUCCESS:
        return { ...state, stellarKeys: undefined, balances: null, payments: null, error: null };

    case REMOVE_STELLAR_KEYS_ERROR:
        return { ...state, stellarKeys: undefined, error: action.payload.error };
    case STORE_STELLAR_KEYS_ERROR:
    case LOAD_STELLAR_KEYS_ERROR:
        return { ...state, error: action.payload.error };

    case SELECT_ACCOUNT:
        return _selectAccount(state, action.payload.name);

    case TOGGLE_MODE_SUCCESS:
        return { ...state, mode: action.payload.mode };

    case LOAD_CONTACTS_SUCCESS:
        return { ...state, contacts: action.payload.contacts };
    case CHANGE_ENV:
        return { ...state, env: action.payload.env };
    default:
        return state;
    }
};

export default stellarReducer;
