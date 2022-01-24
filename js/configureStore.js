// import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import { createStore, applyMiddleware, compose } from 'redux';
import devTools from 'remote-redux-devtools';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';
import sagas from './sagas';

export default function configureStore(onCompletion) {
    console.log('f1 master');
    // const engine = createEngine('local-storage');
    const sagaMiddleware = createSagaMiddleware();
    // const storageMiddleware = storage.createMiddleware(engine);

    const enhancer = compose(
		applyMiddleware(sagaMiddleware),
        devTools({
            name: 'ProxiwebStarterKit', realtime: true,
        }),
	);

    const store = createStore(reducer, enhancer);
    sagas.map(sagaMiddleware.run);

    return store;
}
