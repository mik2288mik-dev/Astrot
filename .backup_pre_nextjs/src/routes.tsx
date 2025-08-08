import MainPage from './pages/MainPage.tsx';
import NatalFormPage from './pages/NatalFormPage.jsx';
import NatalResultPage from './pages/NatalResultPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import InfiniteScrollPage from './pages/InfiniteScrollPage.tsx';

const routes = [
  {
    path: '/',
    component: MainPage,
  },
  {
    path: '/natal-form/',
    component: NatalFormPage,
  },
  {
    path: '/natal-result/',
    component: NatalResultPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },
  {
    path: '/debug-scroll/',
    component: InfiniteScrollPage,
  },
];

export default routes;