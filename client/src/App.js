import "./App.css";
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {


  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [passwordList, setPasswordList] = useState([]);

  useEffect(()=>{
    axios.get("http://localhost:3001/showpasswords").then((response)=>{
    setPasswordList(response.data);
  })
  }, []);

  const addPassword = () => {
    axios.post('http://localhost:3001/addpassword', {
      password: password,
      title: title
    });
  }

  const decryptPassword = (encryption) => {
    axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id === encryption.id
            ? {
                id: val.id,
                password: val.password,
                title: response.data,
                iv: val.iv,
              }
            : val;
        })
      );
    });
  };

  return (
    <div className="App">
      <div className="password-form">
          <input 
            type="text" 
            placeholder="Enter Title" 
            onChange={(e)=>{setTitle(e.target.value);
            }}
          />
          
          <input 
            type="text" 
            placeholder="Enter Password" 
            onChange={(e)=>{setPassword(e.target.value);
            }}
           
          />
          <button onClick={addPassword}>Add Password</button>
      </div>

      <div className="password-list">
            {passwordList.map((val, key)=>{
              return  (
            <div
              className="password"
              onClick={() => {
                decryptPassword({
                  password: val.password,
                  iv: val.iv,
                  id: val.id,
                });
              }}
              key={key}
            >
              <h3>{val.title}</h3>
            </div>
          );
            })}
      </div>
    </div>
  );
}

export default App;
