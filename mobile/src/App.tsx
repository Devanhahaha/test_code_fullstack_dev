import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, listOutline, logOutOutline } from 'ionicons/icons';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Notifications from './pages/Notifications';
import { clearAuth, getToken } from './services/api';
import { NotificationProvider } from './context/NotificationContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

// --- Member Tab Layout with bottom nav ---
// NotificationProvider di-mount di sini agar:
//   1. fetchNotifications() dipanggil saat user masuk area member (on mount)
//   2. NotificationBell & Notifications page berbagi state unreadCount yang sama
const MemberLayout: React.FC = () => {
  return (
    <NotificationProvider>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/tasks" component={Tasks} />
          <Route exact path="/notifications" component={Notifications} />
          <Redirect exact from="/member" to="/dashboard" />
        </IonRouterOutlet>

        <IonTabBar slot="bottom" className="member-tab-bar">
          <IonTabButton tab="dashboard" href="/dashboard">
            <IonIcon icon={homeOutline} />
            <IonLabel>Dashboard</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tasks" href="/tasks">
            <IonIcon icon={listOutline} />
            <IonLabel>My Tasks</IonLabel>
          </IonTabButton>

          <IonTabButton tab="logout" onClick={() => { clearAuth(); window.location.replace('/login'); }} href="#">
            <IonIcon icon={logOutOutline} />
            <IonLabel>Logout</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </NotificationProvider>
  );
};

// --- Root App ---
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Public routes */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />

        {/* Protected member routes (with tab bar) */}
        <Route path="/dashboard" component={MemberLayout} />
        <Route path="/tasks" component={MemberLayout} />
        <Route path="/notifications" component={MemberLayout} />

        {/* Default redirect */}
        <Route exact path="/">
          <Redirect to={getToken() ? '/dashboard' : '/login'} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
