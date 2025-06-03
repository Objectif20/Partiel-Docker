import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App'; 
import {store} from './redux/store'; 
import './i18n';
import { ThemeProvider } from './components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from './components/ui/sonner';


const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <TooltipProvider>
    <App />
    <Toaster />
    </TooltipProvider>
    </ThemeProvider>
  </Provider>
);
