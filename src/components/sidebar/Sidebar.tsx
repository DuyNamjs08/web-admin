import './sidebar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StoreIcon from '@mui/icons-material/Store';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
// import SettingsSystemDaydreamIcon from '@mui/icons-material/SettingsSystemDaydream';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Dark, Light, LogOutauth } from '../../reduxStore/action';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase.Config';
import { useTranslation } from 'react-i18next';

function Sidebar () {
  const { t } = useTranslation(['sidebar']);
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        naviagte('/login');
        dispatch(LogOutauth(null));
        console.log('remove');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="logo">Admin</span>
        </Link>
      </div>

      <div className="center">
        <ul>
          <p className="title">{t('sidebar:main')}</p>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <li>
              <DashboardIcon className="icon" />
              <span>{t('sidebar:dashboard')}</span>
            </li>
          </Link>
          <p className="title">{t('sidebar:lists')}</p>
          <Link to="/user" style={{ textDecoration: 'none' }}>
            <li>
              {' '}
              <AccountCircleIcon className="icon" />
              <span>{t('sidebar:users')}</span>
            </li>
          </Link>
          <Link to="/product" style={{ textDecoration: 'none' }}>
            <li>
              {' '}
              <StoreIcon className="icon" />
              <span>{t('sidebar:products')}</span>
            </li>
          </Link>

          <li>
            {' '}
            <Inventory2Icon className="icon" />
            <span>{t('sidebar:orders')}</span>
          </li>
          <Link to="/category" style={{ textDecoration: 'none' }}>
          <li>
            {' '}
            <LocalShippingIcon className="icon" />
            <span>{t('sidebar:category')}</span>
          </li>
          </Link>
          <p className="title">{t('sidebar:useful')}</p>
          <li>
            {' '}
            <InsertChartIcon className="icon" />
            <span>{t('sidebar:status')}</span>
          </li>
          <li>
            {' '}
            <CircleNotificationsIcon className="icon" />
            <span>{t('sidebar:notifications')}</span>
          </li>
          {/* <p className="title">SERVICE</p> */}
          {/* <li> <SettingsSystemDaydreamIcon className='icon' />
            <span>System heath</span>
          </li> */}
          {/* <li> <ChatBubbleOutlineIcon className='icon' />
            <span>Logs</span>
          </li>
          <li> <SettingsApplicationsIcon  className='icon'/>
            <span>Setting</span>
          </li> */}
          <p className="title">{t('sidebar:user')}</p>
          <li>
            {' '}
            <PersonIcon className="icon" />
            <span>{t('sidebar:profile')}</span>
          </li>
          <li onClick={handleSignout}>
            {' '}
            <LogoutIcon className="icon" />
            <span>{t('sidebar:logout')}</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div onClick={() => dispatch(Dark(false))} className="colorOption"></div>
        <div onClick={() => dispatch(Light(true))} className="colorOption"></div>
      </div>
    </div>
  );
}

export default Sidebar;
