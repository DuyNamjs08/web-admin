import './productTable.scss';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { userColumnProduct } from '../../data/dataTableSource';
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

function ProductTable () {
  const [data, setData] = useState<any>([]);
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
      collection(db, 'product'),
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
      await deleteDoc(doc(db, 'product', id));
      setData(data.filter((item: any) => item?.id !== id));
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
            <Link to="/product/single" style={{ textDecoration: 'none' }}>
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
    <div className="dataProducttable">
      <div className="datatableTitle">
        Add New User
        <Link className="datatableAddLink" to="/product/new">
          Add New
        </Link>
      </div>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          className="datatableBox"
          rows={data}
          columns={userColumnProduct.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

export default ProductTable;
