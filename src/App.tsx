import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import List from './pages/list/List';
import ListProduct from './pages/listProduct/ListProduct';
import New from './pages/newuser/New';
import NewProduct from './pages/newProduct/NewProduct';
import Single from './pages/single/Single';
// import Gggmap from './pages/ggmap/Gggmap'
import Profile from './pages/profile/Profile';
import { productInputs } from './data/formSource';
import './darkmode/style.scss';

import { useSelector } from 'react-redux';
interface AppState {
  reducer: {
      darkMode: boolean;
      currentUser: boolean;
  };

}

function App () {
  const currentUser = useSelector((state:AppState) => state.reducer.currentUser);

  const darkMode = useSelector((state:AppState) => state.reducer.darkMode);
  interface Children {
    children: any;
  }
  const RequireAuth = ({ children }: Children) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? ' App dark' : 'App'}>
      <Router>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />}></Route>
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            ></Route>
            {/* <Route
              path="ggmap"
              element={
                <RequireAuth>
                  <Gggmap />
                </RequireAuth>
              }
            ></Route> */}
            <Route
              path="profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            ></Route>
            <Route path="user">
              <Route
                index
                element={
                  <RequireAuth>
                    <List />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <New />
                  </RequireAuth>
                }
              ></Route>
            </Route>

            <Route path="product">
              <Route
                index
                element={
                  <RequireAuth>
                    <ListProduct />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path=":productId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <NewProduct inputs={productInputs} title="Add New Product" />
                  </RequireAuth>
                }
              ></Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
