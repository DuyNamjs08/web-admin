import * as React from 'react';
import './navbar.scss';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
// import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toggle } from '../../reduxStore/action';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase.Config';

function Navbar () {
  const { i18n } = useTranslation(['sidebar']);
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    i18n.changeLanguage(e.target.value);
  };
  const { darkMode } = useSelector((state: any) => state.reducer);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  interface NavbarSearch {
      img:string
      id:string
      uid: number
      title: string
      description: string
      category: string
      price: string
      stock: number
      status: string
  }
  const [data, setData] = useState<NavbarSearch[]>([]);
  const [filteredData, setFilteredData] = useState<NavbarSearch[]>([]);
  const [wordEntered, setWordEntered] = useState('');

  useEffect(() => {
    if ((localStorage.getItem('i18nextLng') as string)?.length > 2) {
      i18next.changeLanguage('en');
    }
  }, []);
  useEffect(() => {
    const list:any = [];
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'product'));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  console.log('data nav : ', data);
  const handleFilter = (event:any) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.title.toLowerCase().includes(searchWord.toLowerCase());
    });
    if (searchWord === '') {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };
  const clearInput = () => {
    setFilteredData([]);
    setWordEntered('');
  };
  const handleNavigate = () => {
    navigate('/category');
  };
  return (
    <div className="navbar">
      <div className="navbarContainer">
        <div className="search">
          <input type="text" placeholder="Rearch..." value={wordEntered} onChange={ handleFilter} />
          <div className="searchIcon">
            {filteredData.length === 0
              ? (
              <SearchIcon />
                )
              : (
              <CloseIcon id="clearBtn" onClick={clearInput} />
                )}
          </div>
          {filteredData.length !== 0 && (
            <div className="dataResult">
              {filteredData.map((value) => {
                return (
                  <div key={value.id} onClick={handleNavigate} className="dataItem">
                    <p>{value.title} </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="items">
          <div className="item english">
            <LanguageIcon className="icon" />
            <span>
              <select
                onChange={handleLanguageChange}
                value={localStorage.getItem('i18nextLng') as string}
              >
                <option value="en">English</option>
                <option value="jp">Janpan</option>
                <option value="vn">Vietnamese</option>
              </select>
            </span>
          </div>
          <div className="item">
            <DarkModeIcon onClick={() => dispatch(Toggle(!darkMode))} className="icon" />
          </div>
          {/* <div className="item"><FullscreenExitIcon className='icon' /></div> */}
          <div className="item">
            <Link to="/ggmap">
              <LocationOnIcon className="icon" />
            </Link>
          </div>
          <div className="item">
            <NotificationsNoneIcon className="icon" />
            <span className="counter">1</span>
          </div>
          <div className="item">
            <ChatBubbleOutlineIcon className="icon" />
            <span className="counter">2</span>
          </div>
          <div className="item">
            <FormatListBulletedIcon className="icon" />
          </div>
          <div className="item">
            <img
              src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
