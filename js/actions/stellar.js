export const LOAD_USER_ACCOUNT = 'stellar/LOAD_USER_ACCOUNT';
export const LOAD_USER_ACCOUNT_SUCCESS = 'stellar/LOAD_USER_ACCOUNT_SUCCESS';
export const LOAD_USER_ACCOUNT_ERROR = 'stellar/LOAD_USER_ACCOUNT_ERROR';
export const LOAD_PAYMENTS_SUCCESS = 'stellar/LOAD_PAYMENTS_SUCCESS';
export const TRUST = 'stellar/TRUST';
export const TRUST_ERROR = 'stellar/TRUST_ERROR';
export const TRUST_SUCCESS = 'stellar/TRUST_SUCCESS';
export const PAY = 'stellar/PAY';
export const PAY_ERROR = 'stellar/PAY_ERROR';
export const PAY_SUCCESS = 'stellar/PAY_SUCCESS';
export const FEDERATION = 'stellar/FEDERATION';
export const FEDERATION_SUCCESS = 'stellar/FEDERATION_SUCCESS';
export const FEDERATION_ERROR = 'stellar/FEDERATION_ERROR';
export const SET_ERROR = 'stellar/SET_ERROR';
export const CLEAR_ERROR = 'stellar/CLEAR_ERROR';
export const UPDATE_ACCOUNT = 'stellar/UPDATE_ACCOUNT';

export const STORE_STELLAR_KEYS = 'stellar/STORE_STELLAR_KEYS';
export const STORE_STELLAR_KEYS_SUCCESS = 'stellar/STORE_STELLAR_KEYS_SUCCESS';
export const STORE_STELLAR_KEYS_ERROR = 'stellar/STORE_STELLAR_KEYS_ERROR';

export const REMOVE_STELLAR_KEYS = 'stellar/REMOVE_STELLAR_KEYS';
export const REMOVE_STELLAR_KEYS_SUCCESS = 'stellar/REMOVE_STELLAR_KEYS_SUCCESS';
export const REMOVE_STELLAR_KEYS_ERROR = 'stellar/REMOVE_STELLAR_KEYS_ERROR';

export const LOAD_STELLAR_KEYS = 'stellar/LOAD_STELLAR_KEYS';
export const LOAD_STELLAR_KEYS_SUCCESS = 'stellar/LOAD_STELLAR_KEYS_SUCCESS';
export const LOAD_STELLAR_KEYS_ERROR = 'stellar/LOAD_STELLAR_KEYS_ERROR';

export const LOAD_CONTACTS = 'stellar/LOAD_CONTACTS';
export const LOAD_CONTACTS_SUCCESS = 'stellar/LOAD_CONTACTS_SUCCESS';
export const LOAD_CONTACTS_ERROR = 'stellar/LOAD_CONTACTS_ERROR';
export const SAVE_CONTACT = 'stellar/SAVE_CONTACT';
export const DELETE_CONTACT = 'stellar/DELETE_CONTACT';

// @TODO manage error


export const TOGGLE_MODE = 'stellar/TOGGLE_MODE';
export const TOGGLE_MODE_SUCCESS = 'stellar/TOGGLE_MODE_SUCCESS';
export const TOGGLE_MODE_ERROR = 'stellar/TOGGLE_MODE_ERROR';
export const SELECT_ACCOUNT = 'stellar/SELECT_ACCOUNT';

export const CHANGE_WALLET = 'stellar/CHANGE_WALLET';
export const CHANGE_WALLET_SUCCESS = 'stellar/CHANGE_WALLET_SUCCESS';
export const CHANGE_WALLET_ERROR = 'stellar/CHANGE_WALLET_ERROR';

export const REMOVE_WALLET = 'stellar/REMOVE_WALLET';

export const CHANGE_ENV = 'stellar/CHANGE_ENV';

export const loadUserAccount = (accountId) => ({
    type: LOAD_USER_ACCOUNT,
    payload: {
        accountId,
    },
});

export const loadUserAccountError = (err) => ({
    type: LOAD_USER_ACCOUNT_ERROR,
    payload: {
        err,
    },
});

export const accountUserLoaded = (account) => ({
    type: LOAD_USER_ACCOUNT_SUCCESS,
    payload: {
        account,
    },
});

export const paymentsLoaded = (payments) => ({
    type: LOAD_PAYMENTS_SUCCESS,
    payload: {
        payments,
    },
});

export const trust = (currencyCode, maxTrust, issuer, stellarKeys) => ({
    type: TRUST,
    payload: { currencyCode, maxTrust, issuer, stellarKeys },
});

export const trustError = (err) => ({
    type: TRUST_ERROR,
    payload: {
        err,
    },
});

export const trusted = () => ({
    type: TRUST_SUCCESS,
});


export const pay = (destination, currency, currencyIssuer, amount, stellarKeys) => ({
    type: PAY,
    payload: { destination, currency, currencyIssuer, amount, stellarKeys },
});

export const payError = (err) => ({
    type: PAY_ERROR,
    payload: {
        err,
    },
});

export const paid = (payment) => ({
    type: PAY_SUCCESS,
    payload: { payment },
});

export const fedLookup = (fedId) => ({
    type: FEDERATION,
    payload: { fedId },
});

export const fedLookupSuccess = (accountId, fedId) => ({
    type: FEDERATION_SUCCESS,
    payload: { accountId, fedId },
});

export const fedLookupError = (err) => ({
    type: FEDERATION_ERROR,
    payload: { err },
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: { error },
});

export const clearError = () => ({
    type: CLEAR_ERROR,
});

export const updateAccount = (asset, amount) => ({
    type: UPDATE_ACCOUNT,
    payload: { asset, amount },
});

export const loadStellarKeys = () => ({
    type: LOAD_STELLAR_KEYS,
});

export const stellarKeysLoaded = (stellarKeys) => ({
    type: LOAD_STELLAR_KEYS_SUCCESS,
    payload: { stellarKeys },
});

export const stellarKeysNotLoaded = (error) => ({
    type: LOAD_STELLAR_KEYS_ERROR,
    payload: { error },
});

export const storeStellarKeys = (env, stellarKeys) => ({
    type: STORE_STELLAR_KEYS,
    payload: { stellarKeys, env },
});

export const stellarKeysStored = (stellarKeys) => ({
    type: STORE_STELLAR_KEYS_SUCCESS,
    payload: { stellarKeys },
});

export const stellarKeysNotStored = (error) => ({
    type: STORE_STELLAR_KEYS_ERROR,
    payload: { error },
});

export const removeStellarKeys = () => ({
    type: REMOVE_STELLAR_KEYS,
});

export const stellarKeysRemoved = () => ({
    type: REMOVE_STELLAR_KEYS_SUCCESS,
});

export const stellarKeysNotRemoved = (error) => ({
    type: REMOVE_STELLAR_KEYS_ERROR,
    payload: { error },
});

export const toggleMode = () => ({
    type: TOGGLE_MODE,
});

export const modeToggled = (mode) => ({
    type: TOGGLE_MODE_SUCCESS,
    payload: { mode },
});

export const modeNotToggled = (error) => ({
    type: TOGGLE_MODE_ERROR,
    payload: { error },
});

export const changeWallet = (env, name) => ({
    type: CHANGE_WALLET,
    payload: { env, name },
});

export const walletChanged = (name) => ({
    type: CHANGE_WALLET_SUCCESS,
    payload: { name },
});

export const loadContacts = (error) => ({
    type: LOAD_CONTACTS,
    payload: { error },
});

export const contactsLoaded = (contacts) => ({
    type: LOAD_CONTACTS_SUCCESS,
    payload: { contacts },
});

export const contactsNotLoaded = (error) => ({
    type: LOAD_CONTACTS_ERROR,
    payload: { error },
});

export const saveContact = (contact) => ({
    type: SAVE_CONTACT,
    payload: { contact },
});

export const deleteContact = (accountId) => ({
    type: DELETE_CONTACT,
    payload: { accountId },
});

export const removeWallet = (name) => ({
    type: REMOVE_WALLET,
    payload: { name },
});

export const walletNotChanged = (error) => ({
    type: CHANGE_WALLET_ERROR,
    payload: { error },
});

export const changeEnv = (env) => ({
    type: CHANGE_ENV,
    payload: { env },
});

// select the name account of the current env
export const selectAccount = (name) => ({
    type: SELECT_ACCOUNT,
    payload: { name },
});
