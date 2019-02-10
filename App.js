import React from 'react';
import Main from './Components/MainComponent';
import { Provider } from 'react-redux'
import { ConfigureStore } from './redux/configureStore';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Loading } from './Components/LoadingComponent';

const { persistor ,store} = ConfigureStore();

export default class App extends React.Component {
  render() {
    return (
        <Provider store={store}>
          <PersistGate
          loading={<Loading />}
          persistor={persistor}>
            <Main />
        </PersistGate>
        </Provider>
    );
  }
}
