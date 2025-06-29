import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers/index.ts'
import type { TypedUseSelectorHook } from 'react-redux'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

const store = configureStore({
  reducer: rootReducer,
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const container = document.getElementById('root')!;
if (!container.hasChildNodes()) {
  createRoot(container).render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
}
