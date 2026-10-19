import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/Toast';
import { AppProvider } from './lib/app-context';
import { HomePage } from './pages/HomePage';
import { WeekPage } from './pages/WeekPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { RecipePage } from './pages/RecipePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { ShoppingPage } from './pages/ShoppingPage';
import { NotFoundPage } from './pages/NotFoundPage';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[app] render error:', error, info.componentStack);
  }

  override render() {
    if (this.state.error) {
      return (
        <div style={{ maxWidth: 560, margin: '80px auto', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">
            🍳
          </div>
          <h1 style={{ fontSize: 22 }}>页面出了点问题</h1>
          <p style={{ color: '#726b5f', marginTop: 8, fontSize: 14 }}>
            已保存的菜单和收藏不会丢失。刷新页面通常可以恢复。
          </p>
          <pre
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              background: '#f5eee2',
              color: '#7d2e22',
              fontSize: 12,
              textAlign: 'left',
              overflowX: 'auto',
            }}
          >
            {this.state.error.message}
          </pre>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 18 }}
            onClick={() => window.location.reload()}
          >
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  // 静态托管使用 hash 路由，避免 GitHub Pages 等平台刷新子路由 404
  const Router = import.meta.env.VITE_ROUTER_MODE === 'hash' ? HashRouter : BrowserRouter;
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <AppProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="week" element={<WeekPage />} />
                <Route path="discover" element={<DiscoverPage />} />
                <Route path="recipe/:id" element={<RecipePage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="preferences" element={<PreferencesPage />} />
                <Route path="shopping" element={<ShoppingPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </AppProvider>
        </ToastProvider>
      </Router>
    </ErrorBoundary>
  );
}
