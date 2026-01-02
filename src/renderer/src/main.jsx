import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppWrapper } from './components/common/PageMeta.jsx';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { socket, SocketContext } from './context/SocketContext.jsx';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from './context/ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AppWrapper>
            <SocketContext.Provider value={socket}>
              <App />
              <Toaster />
            </SocketContext.Provider>
          </AppWrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
