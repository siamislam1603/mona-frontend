import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../components/App';

const RandomPage = () => {

  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    const response = await axios.get(`${BASE_URL}/user-group/users`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      let { allUser } = response.data;
      setUserData(allUser.filter(user => user.profile_photo && user.profile_photo.includes('https')));
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  // useEffect(() => {
  //   convertBlobToImage();
  // }, [userData]);

  userData && console.log('USER DATA:', userData);

  return (
    <div>
      {
        userData &&
        userData.map(user => {
          return (
            <div>
              <p>{user.id}</p>
              <img src={`${user.profile_photo}`} alt="random bullshit" />
            </div>
          )
        })
      }
    </div>
  );
}

export default RandomPage;