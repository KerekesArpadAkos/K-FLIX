import { Router } from "@lightningjs/sdk";
import { SplashScreen } from "./pages/SplashScreen";
import { Home } from "./pages/Home";
import api from "./utils";
import { PlayerPage } from "./pages/PlayerPage";
import { MovieDetails } from "./pages/MovieDetails";
import SettingsPage from "./pages/SettingsPage";
import SearchInput from "./components/SearchInput";
import SearchPage from "./pages/SearchPage";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfileSelection from "./pages/ProfileSelection";
import CreateProfile from "./pages/CreateProfile";
import {LogoutPage} from "./pages/LogoutPage";

interface PageInstance extends Router.PageInstance {
  loadData: (id: number, isMovie: boolean) => Promise<void>;
}

const routes: Router.Config["routes"] = [
  {
    path: "playerPage/:id",
    component: PlayerPage as Router.PageConstructor<Router.PageInstance>,
  },
  {
    path: "splash",
    component: SplashScreen as Router.PageConstructor<Router.PageInstance>,
  },
  {
    path: "welcome",
    component: WelcomePage as Router.PageConstructor<Router.PageInstance>,
  },
  {
    path: "signin",
    component: LoginPage as Router.PageConstructor<Router.PageInstance>,
  },
  {
    path: "signup",
    component: RegisterPage as Router.PageConstructor<Router.PageInstance>,
  },
  {
    path: "profileselection",
    component: ProfileSelection as Router.PageConstructor<Router.PageInstance>,
  },
  {
    path: "profileselection/:userId?",
    component: ProfileSelection as Router.PageConstructor<Router.PageInstance>,
  },  
  {
    path: "createprofile/:userId",
    component: CreateProfile as Router.PageConstructor<Router.PageInstance>,
  },
  {
    path: "home",
    component: Home as Router.PageConstructor<Router.PageInstance>,
    widgets: ["sidebar"],
  },
  {
    path: "movies",
    component: Home as Router.PageConstructor<Router.PageInstance>,
    widgets: ["sidebar"],
  },
  {
    path: "series",
    component: Home as Router.PageConstructor<Router.PageInstance>,
    widgets: ["sidebar"],
  },
  {
    path: "movie/:id",
    component:
      MovieDetails as unknown as Router.PageConstructor<Router.PageInstance>,
    widgets: ["sidebar"],
    on: (page: PageInstance, { id }) => {
      return new Promise((resolve, reject) => {
        page
          .loadData(Number(id), true)
          .then(() => resolve())
          .catch((error) => reject(error));
      });
    },
  },
  {
    path: "tvshow/:id",
    component:
      MovieDetails as unknown as Router.PageConstructor<Router.PageInstance>,
    widgets: ["sidebar"],
    on: (page: PageInstance, { id }) => {
      return new Promise((resolve, reject) => {
        page
          .loadData(Number(id), false)
          .then(() => resolve())
          .catch((error) => reject(error));
      });
    },
  },
  {
    path: "settings",
    component: SettingsPage as Router.PageConstructor<Router.PageInstance>,
    widgets: ["sidebar"],
  },
  {
    path: "search",
    component: SearchPage as Router.PageConstructor<Router.PageInstance>,
    widgets: ["sidebar"],
  },
  {
    path: "logout",
    component: LogoutPage as unknown as Router.PageConstructor<Router.PageInstance>,
  },
];

const boot = (qs: Router.QueryParams): Promise<void> => {
  return api.loadConfiguration();
};

export const routerConfig: Router.Config = {
  root: "splash",
  boot,
  routes,
};

export default routerConfig;