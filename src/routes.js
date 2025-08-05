import MainPage from './pages/MainPage.jsx';
import NatalFormPage from './pages/NatalFormPage.jsx';
import NatalResultPage from './pages/NatalResultPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

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
];

export default routes;
