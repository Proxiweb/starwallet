import request from 'superagent';
import toml from 'toml';
import StellarSdk from 'stellar-sdk';

const getServer = (env) => {
    switch (env) {
    case 'test':
        StellarSdk.Network.useTestNetwork();
        return new StellarSdk.Server('https://horizon-testnet.stellar.org');
    case 'public':
    default:
        StellarSdk.Network.usePublicNetwork();
        return new StellarSdk.Server('https://horizon.stellar.org');
    }
};

const loadUserAccount =
(env, accountId) => new Promise((resolve, reject) =>
        getServer(env)
        .accounts()
        .accountId(accountId)
        .call()
        .then(accountResult => resolve({
            balances: accountResult.balances,
            sequence: accountResult.sequence,
        }))
        .catch(err => reject(err)));

const loadPayments = (env, accountId) => new Promise((resolve, reject) =>
  getServer(env)
    .payments()
    .forAccount(accountId)
    .order('desc')
    .limit(20)
    .call()
    .then(payments => resolve(payments.records))
    .catch(err => reject(err))
);

const trust = (env, currencyCode, maxTrust, issuer, stellarKeys) => new Promise((resolve, reject) => {
    const limit = maxTrust || undefined;
    const server = getServer(env);
    return server
    .accounts()
    .accountId(stellarKeys.accountId)
    .call()
    .then(account => {
        const userAccount = new StellarSdk.Account(stellarKeys.accountId, account.sequence);
        const transaction = new StellarSdk.TransactionBuilder(userAccount)
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset(currencyCode, issuer),
            limit,
        }))
        .build();
        transaction.sign(StellarSdk.Keypair.fromSeed(stellarKeys.seed));

        return server.submitTransaction(transaction)
        .then(transactionResult => resolve(transactionResult))
        .catch(err => reject(err));
    })
    .catch(err => reject(err));
});

const pay = (env, destination, currency, currencyIssuer, amount, stellarKeys, memoTxt) => new Promise((resolve, reject) => {
    const server = getServer(env);
    return server
    .accounts()
    .accountId(stellarKeys.accountId)
    .call()
    .then(account => {
        const userAccount = new StellarSdk.Account(stellarKeys.accountId, account.sequence);
        const transactionBuilder = new StellarSdk.TransactionBuilder(userAccount)
        .addOperation(StellarSdk.Operation.payment({
            destination,
            asset: new StellarSdk.Asset(currency, currencyIssuer),
            amount: amount.toString(),
        }));

        if (memoTxt) {
            transactionBuilder.addMemo(StellarSdk.Memo.text(memoTxt));
        }

        const transaction = transactionBuilder.build();

        transaction.sign(StellarSdk.Keypair.fromSeed(stellarKeys.seed));
        return server.submitTransaction(transaction)
        .then(transactionResult => resolve(transactionResult))
        .catch(err => reject(err));
    })
    .catch(err => reject(err));
});

const fedLookup = (name) => new Promise((resolve, reject) => {
    const hostname = name.split('*')[1];

    return request
    .get(`https://${hostname}/.well-known/stellar.toml`)
    .end((err, resp) => {
        if (err) {
            return reject(err);
        }
        const configJSON = toml.parse(resp.text);
        const fedServer = configJSON.FEDERATION_SERVER;
        return request
        .get(`${fedServer}?q=${name}&type=name`)
        .type('text/plain')
        .end((error, response) => {
            if (error) {
                reject(error);
            }

            if (!response.body.account_id) {
                reject();
            }

            resolve(response.body.account_id);
        });
    });
});

const hostLookup = (hostname) =>
    new Promise((resolve, reject) =>
        request
            .get(`https://${hostname}/.well-known/stellar.toml`)
            .end((err, resp) => {
                if (err) {
                    return reject(err);
                }
                try {
                    const configJSON = toml.parse(resp.text);
                    return resolve(configJSON);
                } catch (e) {
                    return reject(e);
                }
            }));


module.exports = {
    fedLookup,
    pay,
    trust,
    loadUserAccount,
    loadPayments,
    hostLookup,
};
