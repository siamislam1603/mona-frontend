import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getAuthToken } from '../../../../utils/commonMethods';
import { getUserCoordinatorAPI, getUserDetailAPI } from './ProfileAPI';

export function FetchUserData(userId) {
  const [croppedImage, setCroppedImage] = useState(null);
  const [coordinatorData, setCoordinatorData] = useState([]);
  const [formData, setFormData] = useState({
    telcode: '',
    phone: '',
  });

  // FETCHES THE DATA OF USER FOR EDITING
  const fetchEditUserData = useCallback(async (userId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    };

    const response = await axios.get(getUserDetailAPI(userId), config);
    if (response.status === 200 && response.data.status === 'success') {
      const { user } = response.data;

      if (Object.keys(user).length > 0) {
        axios
          .get(getUserCoordinatorAPI(user?.franchisee_id), config)
          .then((res) => {
            let { coordinators } = res.data;
            setCoordinatorData(
              coordinators.map((coordinator) => ({
                id: coordinator.id,
                value: coordinator.fullname,
                label: coordinator.fullname,
              }))
            );
          })
          .catch((error) => console.log('Error:', error));
        copyDataToState(user);
      } else {
        localStorage.setItem('success_msg', "User doesn't exist!");
        const userRole = localStorage.getItem('user_role');
        if (userRole === 'guardian') window.location.href = '/';
        else window.location.href = '/user-management';
      }
    }
  }, []);

  const copyDataToState = (user) => {
    setFormData((prevState) => ({
      id: user?.id,
      fullname: user?.fullname,
      role: user?.role,
      state: user?.state,
      city: user?.city,
      address: user?.address,
      postalCode: user?.postalCode,
      crn: user?.crn,
      email: user?.email,
      telcode: user?.phone.split('-')[0],
      phone: user?.phone.split('-')[1],
      franchisee_id: user?.franchisee_id,
      nominated_assistant: user?.nominated_assistant || null,
      trainingCategories: user?.training_categories?.map((d) => parseInt(d)),
      professionalDevCategories: user?.professional_development_categories?.map(
        (d) => parseInt(d)
      ),
      coordinator: user?.coordinator,
      businessAssets: user?.business_assets?.map((d) => parseInt(d)),
      terminationDate: user?.termination_date || '',
      termination_reach_me: user?.termination_reach_me,
      user_signature: user?.user_signature,
      profile_photo: user?.profile_photo,
      user_note: user?.user_note,
    }));
    setCroppedImage(user?.profile_photo);
  };

  useEffect(() => {
    fetchEditUserData(userId);
  }, [fetchEditUserData, userId]);

  return {
    formData,
    coordinatorData,
    croppedImage,
  };
}
