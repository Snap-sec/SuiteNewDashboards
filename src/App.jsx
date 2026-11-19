import { AppRouting } from '@/routing/app-routing';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './auth/providers/auth-provider';
import { I18nProvider } from './providers/i18n-provider';
import { QueryProvider } from './providers/query-provider';
import { SettingsProvider } from './providers/settings-provider';
import { ThemeProvider } from './providers/theme-provider';
import { TooltipsProvider } from './providers/tooltips-provider';
import { Provider } from "react-redux";
import { store } from './services/store';
import { RouteChangeHandler } from './route-change-handler';

const { BASE_URL } = import.meta.env;

export function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SettingsProvider>
          <ThemeProvider>
            <I18nProvider>
              <TooltipsProvider>
                <QueryProvider>
                  <LoadingBarContainer>
                    <BrowserRouter basename={BASE_URL}>
                      <RouteChangeHandler />
                      <Toaster />
                      <AppRouting />
                    </BrowserRouter>
                  </LoadingBarContainer>
                </QueryProvider>
              </TooltipsProvider>
            </I18nProvider>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </Provider>
  );
}
