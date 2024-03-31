import React from 'react';
import { Provider } from 'react-redux';

import DiagramControls from './components/DiagramControls';
import store from './store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <DiagramControls />
    </Provider>
  );
};

export default App;
