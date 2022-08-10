import * as React from 'react';
import './newproduct.scss';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/firebase.Config';
import { serverTimestamp, collection, addDoc } from 'firebase/firestore';
// import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

interface Product {
  inputs: any;
  title: string;
}

function NewProduct ({ inputs, title }: Product) {
  console.log(inputs);
  const [file, setFile] = useState<File>();
  const [data, setData] = useState({});
  const [per, setPerc] = useState<null | number>(null);
  const [load, setLoad] = useState<null | number>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const uploadFile = () => {
      const name = file && new Date().getTime() + file.name;
      console.log(name);
      const storageRef = name && ref(storage, name);
      const uploadTask = storageRef && uploadBytesResumable(storageRef, file);
      uploadTask &&
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setPerc(progress);
            setLoad(progress);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              setData((prev) => ({ ...prev, img: downloadURL }));
            });
          }
        );
    };
    file && uploadFile();
  }, [file]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // const res = await createUserWithEmailAndPassword(
      //   auth,
      //   data.email,
      //   data.password
      // );
      // console.log(res);
      // await setDoc(doc(db, "user", res.user.uid), {
      //   ...data,
      //   timestamp: serverTimestamp(),
      // });
      await addDoc(collection(db, 'product'), {
        ...data,
        timestamp: serverTimestamp()
      });
      navigate('/product');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="newProduct">
      <Sidebar />
      <div className="newProductContainer">
        <Navbar />
        <div style={{ marginTop: 80 }}>
          <div className="top">
            <h1>{title}</h1>
          </div>
          <div className="bottom">
            <div className="left">
              {load
                ? (
                <img
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : 'https://png.pngtree.com/png-clipart/20190918/ourmid/pngtree-load-the-3273350-png-image_1733730.jpg'
                  }
                  alt=""
                />
                  )
                : (
                <img
                  src={
                    'https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png'
                  }
                  alt=""
                />
                  )}
              <div>Maximum file size 1 MB</div>
              <div>Format: .JPEG, .PNG</div>
            </div>
            <div className="right">
              <form onSubmit={(e) => handleAdd}>
                <div className="formInput">
                  <label htmlFor="file">
                    <CloudUploadIcon />
                  </label>
                  <input id="file" type="file" onChange={(e) => setFile(e.target.files![0])} />
                </div>
                {inputs.map((item: any) => {
                  return (
                    <div className="formInput" key={item.id}>
                      <label>{item.label}</label>
                      <input
                        id={item.id}
                        type={item.type}
                        placeholder={item.placeholder}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                  );
                })}

                <button type="submit" disabled={per !== null && per < 100}>
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewProduct;
