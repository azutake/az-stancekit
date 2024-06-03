/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { StanceContextProvider } from './states/stanceContext'
import { StanceCurrentValuesContextProvider, StanceDefaultValuesContextProvider } from './states/stanceValuesContext'
import { LocaleContextProvider } from './states/localeContext'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(() =>
  <LocaleContextProvider>
    <StanceDefaultValuesContextProvider>
      <StanceCurrentValuesContextProvider>
        <StanceContextProvider>
          <App />
        </StanceContextProvider>
      </StanceCurrentValuesContextProvider>
    </StanceDefaultValuesContextProvider>
  </LocaleContextProvider>, root!);
