import './single.scss';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Chart from '../../components/chart/Chart';
import Lists from '../../components/table/Table';
import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.Config';
import { useLocation } from 'react-router-dom';

function Single () {
  interface UserView {
    img:string
    id:string
    username: string
    email: string
    phone: string
    password: string
    address: string
    country: string
    yearofbirth: string
}
  const [data, setData] = useState<UserView>();
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  console.log('data user :', state);
  const handleView = useCallback(async () => {
    const docRef = doc(db, 'user', state as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      //   console.log("Document data:", docSnap.data());
      setData(docSnap.data() as UserView);
      setLoading(false);
    } else {
      console.log('No such document!');
    }
  }, [state]);
  useEffect(() => {
    if (state !== undefined && state !== '') {
      handleView();
    }
  }, [handleView, state]);

  const Loading = () => {
    return <div>loading .....</div>;
  };
  const ShowProduct = () => {
    return <div className="left">
    <div className="editButton">Edit</div>
    <h1 className="title">Information</h1>
    <div className="item">
      <img
        src={data!.img}
        alt=""
        className="itemImg"
      />
      <div className="details">
        <h1 className="itemTitle">{data!.username}</h1>
        <div className="detailItem">
          <span className="itemKey">Email:</span>
          <span className="itemValue">{data!.email}</span>
        </div>
        <div className="detailItem">
          <span className="itemKey">Phone:</span>
          <span className="itemValue">{data!.phone}</span>
        </div>
        <div className="detailItem">
          <span className="itemKey">Address:</span>
          <span className="itemValue">{data!.address}</span>
        </div>
        <div className="detailItem">
          <span className="itemKey">Country:</span>
          <span className="itemValue">{data!.country}</span>
        </div>
      </div>
    </div>
  </div>;
  };
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div style={{ marginTop: 50 }}>
          <div className="top">
          <div>{loading ? <Loading /> : <ShowProduct />}</div>
            <div className="right">
              <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
            </div>
          </div>
          <div className="bottom">
            <Lists />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Single;
