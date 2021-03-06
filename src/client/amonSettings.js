// import Amon from 'amon';
import Amon from '../amon';
import models from './models';
import views from './views';
// import styles from './styles';
import menus from './menus';
import enums from './enums';

const settings = {
  apiUrl: 'http://graph.cool/api/123132',
}

const amon = new Amon({ models, views, settings, menus, enums });

export default amon;
