import { createSelector } from 'reselect';

const selectStellarDomain = () => state => state.stellar;

export const selectEnv = () => createSelector(
  selectStellarDomain(),
  (state) => state.env
);

export const selectPayments = () => createSelector(
  selectStellarDomain(),
  (state) => state.payments
);

export const selectMode = () => createSelector(
  selectStellarDomain(),
  (state) => state.mode
);

export const selectPending = () => createSelector(
  selectStellarDomain(),
  (state) => state.pending
);

export const selectError = () => createSelector(
  selectStellarDomain(),
  (state) => state.error
);

export const selectStellarKeys = () => createSelector(
  selectStellarDomain(),
  (state) => state.stellarKeys
);

export const selectCurrentWalletName = () => createSelector(
  selectEnv(),
  selectStellarKeys(),
  (env, stellarKeys) => {
      let activeName = null;
      if (!stellarKeys || !stellarKeys[env]) return activeName;

      const walletKeys = Object.keys(stellarKeys[env]);

      walletKeys.forEach(name => {
          if (stellarKeys[env][name].active === true) {
              activeName = name;
          }
      });

      // HACK sometimes for all accounts active === false
      if (walletKeys.length > 0 && !activeName) {
          return stellarKeys[env][walletKeys[0]];
      }

      return activeName;
  }
);

export const selectCurrentStellarKeys = () => createSelector(
  selectEnv(),
  selectStellarKeys(),
  selectCurrentWalletName(),
  (env, stellarKeys, walletName) => {
      if (!stellarKeys || !walletName) return null;
      return stellarKeys[env][walletName];
  }
);

export const selectAllContacts = () => createSelector(
  selectStellarDomain(),
  (state, env) => state.contacts,
);

export const selectContacts = () => createSelector(
  selectStellarDomain(),
  selectEnv(),
  (state, env) => (state.contacts ? state.contacts.filter(contact => contact.env === env) : null),
);

export const selectPaymentsWithContactName = () => createSelector(
  selectAllContacts(),
  selectCurrentStellarKeys(),
  selectPayments(),
  (contacts, stellarKeys, payments) =>
      payments
          .map(payment => {
              if (payment.source_account === stellarKeys.accountId) {
                  return { ...payment, source_account: 'me', from: 'me' };
              }

              const contactFound = contacts.find(contact => contact.accountId === payment.source_account);
              if (contactFound && contactFound.name) {
                  return { ...payment, source_account: contactFound.name, from: contactFound.name };
              }

              return payment;
          })
          .map(payment => {
              if (payment.to === stellarKeys.accountId) {
                  return { ...payment, to: 'me' };
              }

              const contactFound = contacts.find(contact => contact.accountId === payment.to);
              if (contactFound && contactFound.name) {
                  return { ...payment, to: contactFound.name };
              }

              return payment;
          })
);

export const selectBalances = () => createSelector(
  selectStellarDomain(),
  (state) => state.balances
);

export default selectStellarDomain;
