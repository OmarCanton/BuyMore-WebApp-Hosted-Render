import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store, persistor } from './Redux/Store/store.jsx'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={"Loading..."} persistor={persistor}>
        <Router>
          <App />
        </Router>
    </PersistGate>
    </Provider>,
)
