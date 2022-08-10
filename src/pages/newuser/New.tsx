import * as React from 'react';
import './new.scss';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState, useEffect } from 'react';
import { db, auth, storage } from '../../firebase/firebase.Config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

function New () {
  const [file, setFile] = useState<File>();
  const [img, setImg] = useState({});
  const [per, setPerc] = useState<null | number>(null);
  const [error, setError] = useState(false);
  const [loadImg, setLoadImg] = useState(true);
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
              setImg((prev) => ({ ...prev, img: downloadURL }));
              setLoadImg(true)
            });
          }
        );
    };
    file && uploadFile();
  }, [file]);

  interface FormValues {
    file: string
    fullname: string
    username: string
    yearofbirth: string
    email: string
    phone: number
    password: string
    address: string
  }
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({});

  const handleAdd: SubmitHandler<FormValues> = async (data) => {
    const dataNew = { ...data, ...img };
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log(res);
      await setDoc(doc(db, 'user', res.user.uid), {
        ...dataNew,
        timestamp: serverTimestamp()
      });
      navigate('/user');
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div style={{ marginTop: 80 }}>
          <div className="top">
            <h1>Add New User</h1>
          </div>
          <div className="bottom">
            <div className="left">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                }
                alt=""
              />
            </div>
            <div className="right">
              <form onSubmit={handleSubmit(handleAdd)}>
                <div className="formInput">
                  <label htmlFor="file">
                    <CloudUploadIcon />
                  </label>
                  <input id="file" type="file" onChange={(e) => setFile(e.target.files![0])} />
                </div>

                <div className="formInput">
                  <label>Username</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="username"
                    {...register('username', {
                      required: 'Vui lòng nhập thông tin'
                    })}
                  />
                  {errors.username && <p className="messages">{errors.username.message}</p>}
                </div>

                <div className="formInput">
                  <label>Email</label>
                  <input
                    id="email"
                    type="mail"
                    placeholder="123@gmail.com"
                    {...register('email', {
                      required: 'Vui lòng nhập email',
                      pattern: {
                        value: /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/,
                        message: 'Vui lòng nhập email'
                      }
                    })}
                  />
                  {errors.email && <p className="messages">{errors.email.message}</p>}
                </div>

                <div className="formInput">
                  <label>Year of Birth</label>
                  <input
                    id="yearofbirth"
                    type="date"
                    placeholder="01/01"
                    {...register('yearofbirth', {
                      required: 'Vui lòng nhập ngày tháng năm sinh'
                    })}
                  />
                  {errors.yearofbirth && <p className="messages">{errors.yearofbirth.message}</p>}
                </div>

                <div className="formInput">
                  <label>Phone</label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="0986856852"
                    {...register('phone', {
                      required: 'Vui lòng nhập số điện thoại',
                      pattern: {
                        value: /\d+/,
                        message: 'Vui lòng nhập số điện thoại '
                      }
                    })}
                  />
                  {errors.phone && <p className="messages">{errors.phone.message}</p>}
                </div>

                <div className="formInput">
                  <label>Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="@123456"
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu',
                      minLength: {
                        value: 6,
                        message: 'Vui lòng nhập 6 ký tự'
                      }
                    })}
                  />
                  {errors.address && <p className="messages">{errors.address.message}</p>}
                </div>

                <div className="formInput">
                  <label>Address</label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Cầu Giấy, Hà Nội"
                    {...register('address', {
                      required: 'Vui lòng nhập địa chỉ'
                    })}
                  />
                  {errors.password && <p className="messages">{errors.password.message}</p>}
                </div>

                <button type="submit" disabled={per !== null && per < 100 && loadImg}>
                  Send
                </button>
                {error && <p className="messageSubmit">Đã có tài khoản trên hệ thống</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default New;
