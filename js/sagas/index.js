import { take, put, call, select } from 'redux-saga/effects';
import update from 'react-addons-update';
import { AsyncStorage } from 'react-native';
import { selectEnv, selectMode, selectStellarKeys, selectCurrentStellarKeys, selectAllContacts } from '../selectors';

import {
    LOAD_USER_ACCOUNT,
    STORE_STELLAR_KEYS,
    LOAD_STELLAR_KEYS,
    REMOVE_STELLAR_KEYS,
    TOGGLE_MODE,
    CHANGE_WALLET,
    REMOVE_WALLET,
    CHANGE_ENV,
    TRUST_SUCCESS,
    PAY_SUCCESS,
    LOAD_CONTACTS,
    SAVE_CONTACT,
    DELETE_CONTACT,

    loadUserAccountError,
    loadUserAccount,
    accountUserLoaded,
    paymentsLoaded,
    stellarKeysLoaded,
    stellarKeysNotLoaded,
    stellarKeysStored,
    stellarKeysNotStored,
    stellarKeysRemoved,
    selectAccount,
    contactsLoaded,
    contactsNotLoaded,
    clearError,

    modeToggled,
    modeNodeToggled,
} from '../actions/stellar';

import {
    replaceOrPushRoute,
    replaceRoute,
} from '../actions/route';

import api from '../helpers/api';

// const delay = (tempo) => new Promise(resolve => {
//     setTimeout(() => {
//         resolve();
//     }, tempo);
// });

export function* loadStellarKeysSaga() {
    while(1) { // eslint-disable-line
        yield take(LOAD_STELLAR_KEYS);
        try {
            // load stellarkeys in store
            const allStellarKeysStr = yield call(AsyncStorage.getItem, 'stellarKeys');
            const allStellarKeys = JSON.parse(allStellarKeysStr);
            yield put(stellarKeysLoaded(allStellarKeys));

            // find active wallet
            const stellarKeys = yield select(selectCurrentStellarKeys());

            if (stellarKeys) {
                yield put(loadUserAccount(stellarKeys.accountId));
            }
        } catch (error) {
            yield put(stellarKeysNotLoaded(error));
        }
    }
}

export function* storeStellarKeysSaga() {
    while(1) { // eslint-disable-line
        const action = yield take(STORE_STELLAR_KEYS);
        const { stellarKeys, env } = action.payload;
        const currentStellarKeys = yield select(selectStellarKeys());
        const { name, accountId, seed } = stellarKeys;

        let newStellarKeys = {};

        const otherEnvKeys = {};
        const otherEnv = env === 'test' ? 'public' : 'test';
        // @TODO refactor with _.omit
        if (currentStellarKeys && currentStellarKeys[otherEnv]) {
            // store other env keys
            otherEnvKeys[otherEnv] = currentStellarKeys[otherEnv];
        }

        const active = true;

        if (!currentStellarKeys || !currentStellarKeys[env]) {  // first one
            newStellarKeys[env] = { [name]: { accountId, seed, active } };
        } else if (currentStellarKeys[env][name]) {  // replace
            newStellarKeys = update(currentStellarKeys, { [env]: { [name]: { $set: { accountId, seed, active } } } });
        } else {
            newStellarKeys = update( // add
              currentStellarKeys,
              { [env]: { $set: Object.assign(currentStellarKeys[env], { [name]: { accountId, seed, active } }) } }
            );
        }

        try {
            const allKeys = Object.assign(newStellarKeys, otherEnvKeys);
            yield call(AsyncStorage.setItem, 'stellarKeys', JSON.stringify(allKeys));
            yield put(stellarKeysStored(allKeys));
            yield put(selectAccount(name));
            yield put(loadUserAccount(accountId));
        } catch (error) {
            yield put(stellarKeysNotStored(error));
            yield put(replaceOrPushRoute('home'));
        }
    }
}

export function* toggleModeSaga() {
  while(1) { // eslint-disable-line
      yield take(TOGGLE_MODE);
      const mode = yield select(selectMode());
      const newMode = mode === 'basic' ? 'advanced' : 'basic';
      try {
          yield call(AsyncStorage.setItem, 'mode', newMode);
          yield put(modeToggled(newMode));
      } catch (error) {
          yield put(modeNodeToggled(error));
      }
  }
}

export function* changeWalletSaga() {
  while(1) { // eslint-disable-line
      const action = yield take(CHANGE_WALLET);
      const env = action.payload.env;
      // build new version of wallet state
      const currentStellarKeys = yield select(selectStellarKeys());

      Object.keys(currentStellarKeys[env]).forEach(walletName => {
          currentStellarKeys[env][walletName].active = walletName === action.name;
      });

      // @TODO refactor to DRY with storeStellarKeysSaga
      const otherEnvKeys = {};
      const otherEnv = env === 'test' ? 'public' : 'test';
      // @TODO refactor with _.omit
      if (currentStellarKeys && currentStellarKeys[otherEnv]) {
          // store other env keys
          otherEnvKeys[otherEnv] = currentStellarKeys[otherEnv];
      }

      try {
          const allKeys = Object.assign(currentStellarKeys, otherEnvKeys);
          yield call(AsyncStorage.setItem, 'stellarKeys', JSON.stringify(allKeys));
          yield put(stellarKeysStored(allKeys));
          yield put(selectAccount(action.payload.name));

          // find new wallet selected keys
          const stellarKeys = yield select(selectCurrentStellarKeys());
          yield put(loadUserAccount(stellarKeys.accountId));
        //   yield put(replaceOrPushRoute('home'));
      } catch (error) {
          yield put(stellarKeysNotStored(error));
          yield put(replaceOrPushRoute('home'));
      }
  }
}

export function* removeWalletSaga() {
    while(1) { // eslint-disable-line
        const action = yield take(REMOVE_WALLET);
        const env = yield select(selectEnv());
        const currentStellarKeys = yield select(selectStellarKeys());
        const newStellarKeys = {};
        const otherEnv = env === 'test' ? 'public' : 'test';

        // HACK in edge cases all accounts deleted and REMOVE_WALLET fired
        if (currentStellarKeys) {
            if (currentStellarKeys[otherEnv]) {
                newStellarKeys[otherEnv] = currentStellarKeys[otherEnv];
            }

            Object.keys(currentStellarKeys[env]).forEach(key => {
                if (key !== action.payload.name) {
                    newStellarKeys[env][key] = currentStellarKeys[env][key];
                }
            });

            try {
                yield call(AsyncStorage.setItem, 'stellarKeys', JSON.stringify(newStellarKeys));
                yield put(stellarKeysStored(newStellarKeys));
                yield put(clearError());
                yield put(replaceOrPushRoute('home'));
            } catch (error) {
                yield put(stellarKeysNotStored(error));
                yield put(replaceOrPushRoute('home'));
            }
        }
    }
}

export function* removeStellarKeysSaga() {
    while(1) { // eslint-disable-line
        yield take(REMOVE_STELLAR_KEYS);
        try {
            yield call(AsyncStorage.removeItem, 'stellarKeys');
            yield put(stellarKeysRemoved());
        } catch (error) {
            yield put(stellarKeysNotStored(error));
        }
    }
}


export function* reloadAccountInfosOnTrust() {
    while(1) { // eslint-disable-line
        const action = yield take(TRUST_SUCCESS);
        const env = yield select(selectEnv());
        try {
            yield put(replaceOrPushRoute('home'));
            const account = yield call(api.loadUserAccount, env, action.payload.accountId);
            yield put(accountUserLoaded(account));
        } catch (err) {
            yield put(loadUserAccountError(err));
        }
    }
}

export function* loadUserAccountSaga() {
    while(1) { // eslint-disable-line
        const action = yield take(LOAD_USER_ACCOUNT);
        const env = yield select(selectEnv());
        try {
            yield put(replaceOrPushRoute('home'));
            const account = yield call(api.loadUserAccount, env, action.payload.accountId);
            yield put(accountUserLoaded(account));
            const payments = yield call(api.loadPayments, env, action.payload.accountId);
            yield put(paymentsLoaded(payments));
        } catch (err) {
            yield put(loadUserAccountError(err));
        }
    }
}

export function* addContactIfNotExistsAfterPayement() {
    while(1) {  // eslint-disable-line
        const action = yield take(PAY_SUCCESS);
        const { payment } = action.payload;
        const contacts = yield select(selectAllContacts());

        const env = yield select(selectEnv());
        const contactExists = contacts.find(contact => contact.accountId === payment.dest && contact.env === env);
        if (!contactExists) {
            const newContact = {
                accountId: payment.dest,
                fedId: payment.fedId,
                env,
            };

            contacts.push(newContact);

            try {
                yield call(AsyncStorage.setItem, 'contacts', JSON.stringify(contacts));
                yield put(contactsLoaded(contacts));
            } catch (e) {
                console.log(e);
            }
        }
    }
}

export function* loadContactsSaga() {
    while(1) { // eslint-disable-line
        yield take(LOAD_CONTACTS);
        try {
            const contacts = yield call(AsyncStorage.getItem, 'contacts');
            yield put(contactsLoaded(JSON.parse(contacts) || []));
        } catch (e) {
            yield put(contactsNotLoaded(e));
        }
    }
}

export function* saveContactSaga() {
    while(1) { // eslint-disable-line
        const action = yield take(SAVE_CONTACT);
        const newContact = action.payload.contact;
        const contacts = yield select(selectAllContacts());

        try {
            const newContacts = contacts.map(contact => (contact.accountId === newContact.accountId ? newContact : contact));
            yield call(AsyncStorage.setItem, 'contacts', JSON.stringify(newContacts));
            yield put(contactsLoaded(newContacts));
            yield put(replaceRoute('contacts'));
        } catch (e) {
            yield put(contactsNotLoaded(e));
        }
    }
}

export function* deleteContactSaga() {
    while(1) { // eslint-disable-line
        const action = yield take(DELETE_CONTACT);
        const accountIdToDelete = action.payload.accountId;
        const contacts = yield select(selectAllContacts());

        try {
            const newContacts = contacts.filter(contact => (contact.accountId !== accountIdToDelete));
            yield call(AsyncStorage.setItem, 'contacts', JSON.stringify(newContacts));
            yield put(contactsLoaded(newContacts));
            yield put(replaceRoute('contacts'));
        } catch (e) {
            yield put(contactsNotLoaded(e));
        }
    }
}

export function* redirecToHomepageOnEnvChange() {
  while(1) { // eslint-disable-line
      yield take(CHANGE_ENV);
      const stellarKeys = yield select(selectCurrentStellarKeys());
      if (stellarKeys) {
          yield put(loadUserAccount(stellarKeys.accountId));
      } else {
          yield put(replaceOrPushRoute('home'));
      }
  }
}

export default [
    saveContactSaga,
    deleteContactSaga,
    removeWalletSaga,
    loadContactsSaga,
    addContactIfNotExistsAfterPayement,
    toggleModeSaga,
    redirecToHomepageOnEnvChange,
    loadStellarKeysSaga,
    storeStellarKeysSaga,
    removeStellarKeysSaga,
    changeWalletSaga,
    reloadAccountInfosOnTrust,
    loadUserAccountSaga,
];
