import './datatable.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { userColumns } from '../../data/dataTableSource';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  collection,
  // getDocs,
  doc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../firebase/firebase.Config';

function Datatable () {
  const [data, setData] = useState([]);
  useEffect(() => {
    // const list=[]
    // const fetchData = async () => {
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "user"));
    //     querySnapshot.forEach((doc) => {
    //       list.push({id:doc.id, ...doc.data()})
    //     });
    //     setData(list)
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // fetchData()

    // listen Realtime

    const unsub = onSnapshot(
      collection(db, 'user'),
      (snapShot) => {
        const list: any = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);
  const handleDelete = async (id: any) => {
    try {
      await deleteDoc(doc(db, 'user', id));
      setData(data.filter((item: any) => item.id !== id));
    } catch (error) {}
  };
  const actionColumn = [
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params: any) => {
        console.log('checkk id :', params.row.id);
        return (
          <div className="cellAction">
            <Link to="/user/test" style={{ textDecoration: 'none' }}>
              <div className="viewButton">View</div>
            </Link>
            <div className="deleteButton" onClick={() => handleDelete(params.row.id)}>
              Delete
            </div>
          </div>
        );
      }
    }
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New User
        <Link className="datatableAddLink" to="/user/new">
          Add New
        </Link>
      </div>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          className="datatableBox"
          rows={data}
          columns={userColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

export default Datatable;
