import axios from 'axios';
import ImageCropPopup from '../components/ImageCropPopup/ImageCropPopup';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Form, Modal } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import { Link } from 'react-router-dom';
import {
  getLoggedInUserRole,
  isUserAllowed,
  getAuthToken,
  getUserAPIs,
} from '../utils/commonMethods';
import DragDropSingle from '../components/DragDropSingle';
import moment from 'moment';
import { FullLoader } from '../components/Loader';

const useFetchBatchDatFromAPIs = () => {
  const [userRoleData, setUserRoleData] = useState([]);
  const [franchiseeData, setFranchiseeData] = useState(null);
  const [trainingCategoryData, setTrainingCategoryData] = useState([]);
  const [pdcData, setPdcData] = useState([]);
  const [businessAssetData, setBuinessAssetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAPIData = useCallback(async () => {
    let apiArray = getUserAPIs();
    let config = {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    };

    let requests = apiArray.map((item) => axios.get(item, config));

    await axios
      .all(requests)
      .then((response) => {
        let [
          userRoleDataRes,
          trainingCategoryDataRes,
          pdcDataRes,
          businessAssetDataRes,
          franchiseDataRes,
        ] = response;

        let userRoleList = userRoleDataRes?.data?.userRoleList;
        let trainingCategoryList = trainingCategoryDataRes?.data?.categoryList;
        let pdcList = pdcDataRes?.data?.pdcList;
        let businessAssetList = businessAssetDataRes?.data?.businessAssetList;
        let franchiseList = franchiseDataRes?.data?.franchiseeList;

        // SETTING THE DESIRED STATE;
        setUserRoleData(
          userRoleList.map((d) => ({
            id: d.id,
            value: d.role_name,
            label: d.role_label,
            sequence: d.role_sequence,
          }))
        );

        setTrainingCategoryData([
          ...trainingCategoryList.map((data) => ({
            id: data.id,
            value: data.category_name,
            label: data.category_name,
          })),
        ]);

        setPdcData(
          pdcList.map((data) => ({
            id: data.id,
            value: data.category_name,
            label: data.category_name,
          }))
        );

        setBuinessAssetData(
          businessAssetList.map((data) => ({
            id: data.id,
            value: data.asset_name,
            label: data.asset_name,
          }))
        );

        setFranchiseeData(
          franchiseList.map((franchisee) => ({
            id: franchisee.id,
            value: franchisee.franchisee_name,
            label: franchisee.franchisee_name,
          }))
        );

        setIsLoading(false);
      })
      .catch((err) => {
        console.log('Error:', err);
        setError(`Coudldn't fetch user details`);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAPIData();
  }, [fetchAPIData]);

  return {
    userRoleData,
    trainingCategoryData,
    pdcData,
    businessAssetData,
    franchiseeData,
    isLoading,
    error,
  };
};

const ViewUser = () => {
  const { userId } = useParams();
  const authToken = getAuthToken();

  const [formData, setFormData] = useState({
    telcode: '',
    phone: '',
  });
  const [coordinatorData, setCoordinatorData] = useState([]);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [selectedFranchisee, setSelectedFranchisee] = useState();

  // FETCHES THE DATA OF USER FOR EDITING
  const fetchEditUserData = async () => {
    const response = await axios.get(`${BASE_URL}/auth/user/info/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response.status === 200 && response.data.status === 'success') {
      const { user } = response.data;

      if (Object.keys(user).length > 0) {
        copyDataToState(user);
      } else {
        localStorage.setItem('success_msg', "User doesn't exist!");
        const userRole = localStorage.getItem('user_role');
        if (userRole === 'guardian') window.location.href = '/';
        else window.location.href = '/user-management';
      }
    }
  };

  const canViewUserNote = () => {
    let role = getLoggedInUserRole();

    return (
      role === 'franchisor_admin' ||
      role === 'franchisee_admin' ||
      role === 'coordinator'
    );
  };

  const copyDataToState = (user) => {
    setCurrentRole(user?.role);
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
      // assign_random_password: user?.assign_random_password ? true : false,
      // change_pwd_next_login: user?.change_pwd_next_login ? true : false,
      user_note: user?.user_note,
    }));
    setCroppedImage(user?.profile_photo);
  };

  const {
    userRoleData,
    trainingCategoryData,
    pdcData,
    businessAssetData,
    franchiseeData,
    isLoading,
    error,
  } = useFetchBatchDatFromAPIs();

  const fetchCoordinatorData = async (franchisee_id) => {
    const response = await axios.get(
      `${BASE_URL}/role/franchisee/coordinator/franchiseeID/${franchisee_id}/coordinator`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (response.status === 200 && response.data.status === 'success') {
      let { coordinators } = response.data;
      setCoordinatorData(
        coordinators.map((coordinator) => ({
          id: coordinator.id,
          value: coordinator.fullname,
          label: coordinator.fullname,
        }))
      );
    }
  };

  const isUserNoteAvailable = (note) => {
    return note?.length === 0 || note === 'null' || note === null
      ? false
      : true;
  };

  const populateUserRole = () => {
    let data = userRoleData.filter((d) => d.value === formData?.role) || '';
    return data[0]?.label;
  };

  const populateUserPhone = () => {
    let phone =
      formData?.telcode && formData?.phone
        ? `${formData?.telcode}-${formData?.phone}`
        : '';

    return phone;
  };

  const populateUserFranchise = (franchiseList, franchiseId) => {
    let data = franchiseList?.filter(
      (item) => parseInt(item.id) === parseInt(franchiseId)
    );

    return data ? data[0]?.label : '';
  };

  const populateUserPDC = () => {
    let data = pdcData?.filter((d) =>
      formData?.professionalDevCategories?.includes(parseInt(d.id))
    );
    data = data.map((item) => item.label);

    return data ? data.join(', ') : '';
  };

  const populateUserTrainingCategoryData = () => {
    let data = trainingCategoryData?.filter((d) =>
      formData?.trainingCategories?.includes(parseInt(d.id))
    );

    data = data.map((item) => item.label);

    return data ? data.join(', ') : '';
  };

  const populateUserBusinessAssets = () => {
    let data = businessAssetData?.filter((d) =>
      formData?.businessAssets?.includes(parseInt(d.id))
    );

    data = data.map((item) => item.label);

    return data ? data.join(', ') : '';
  };

  const populateCoordinator = () => {
    let data = coordinatorData.filter(
      (item) => parseInt(item.id) === parseInt(formData?.coordinator)
    );

    return data && data.length > 0 ? data[0]?.label : '';
  };

  useEffect(() => {
    fetchEditUserData();
  }, []);

  useEffect(() => {
    fetchCoordinatorData(formData.franchisee_id);
  }, [formData.franchisee_id]);

  return (
    <>
      <div id="main">
        <section className="mainsection">
          <FullLoader loading={isLoading} />
          <Container>
            <div className="admin-wrapper">
              <div className="sec-column">
                <div className="entry-container">
                  <div className="maincolumn">
                    <div className="new-user-sec">
                      <div className="user-pic-sec">
                        <DragDropSingle
                          disable="true"
                          croppedImage={croppedImage}
                          setCroppedImage={setCroppedImage}
                          onSave={setImage}
                          setPopupVisible={setPopupVisible}
                          fetchedPhoto={formData?.profile_photo || ''}
                        />

                        {popupVisible && (
                          <ImageCropPopup
                            image={image}
                            setCroppedImage={setCroppedImage}
                            setPopupVisible={setPopupVisible}
                          />
                        )}
                      </div>
                      <form className="user-form error-sec">
                        <Row>
                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Full Name</Form.Label>
                            <p>{formData?.fullname}</p>
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>User Role</Form.Label>
                            <p>
                              {populateUserRole(userRoleData, formData?.role)}
                            </p>
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3">
                            <Form.Label>State</Form.Label>
                            <p>{formData?.state}</p>
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Suburb</Form.Label>
                            <p>{formData?.city}</p>
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Address</Form.Label>
                            <p>{formData?.address}</p>
                          </Form.Group>

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Post Code</Form.Label>
                            <p>{formData?.postalCode}</p>
                          </Form.Group>

                          {formData?.role === 'guardian' && (
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>CRN</Form.Label>
                              <p>{formData?.crn}</p>
                            </Form.Group>
                          )}

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Email Address</Form.Label>
                            <p>{formData?.email}</p>
                          </Form.Group>

                          {formData && formData?.role !== 'guardian' && (
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Training Categories</Form.Label>
                              <p>{populateUserTrainingCategoryData()}</p>
                            </Form.Group>
                          )}

                          {formData && formData?.role !== 'guardian' && (
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>
                                Professional Development Categories
                              </Form.Label>
                              <p>{populateUserPDC()}</p>
                            </Form.Group>
                          )}

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Contact Number</Form.Label>
                            <div className="tel-col">
                              <p>{populateUserPhone()}</p>
                            </div>
                          </Form.Group>

                          {formData && formData?.role === 'educator' && (
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Nominated Assistant</Form.Label>
                              <p>{formData?.nominated_assistant}</p>
                            </Form.Group>
                          )}

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Select Franchise</Form.Label>
                            <p>
                              {populateUserFranchise(
                                franchiseeData,
                                formData?.franchisee_id
                              )}
                            </p>
                          </Form.Group>

                          {formData?.role === 'educator' && (
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>
                                Select Primary Coordinator
                              </Form.Label>
                              <p>{populateCoordinator()}</p>
                            </Form.Group>
                          )}

                          {formData && formData?.role !== 'guardian' && (
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Business Assets</Form.Label>
                              <p>{populateUserBusinessAssets()}</p>
                            </Form.Group>
                          )}

                          {isUserNoteAvailable(formData?.user_note) &&
                            canViewUserNote() &&
                            isUserAllowed(formData?.role, [
                              'educator',
                              'guardian',
                            ]) && (
                              <Form.Group className="col-md-12 mb-3 relative">
                                <Form.Label>User Note</Form.Label>
                                <p>{formData?.user_note}</p>
                              </Form.Group>
                            )}

                          {formData?.terminationDate && (
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Termination Date</Form.Label>
                              <p>{formData?.terminationDate}</p>
                            </Form.Group>
                          )}

                          <Col md={12}>
                            <div className="cta text-center mt-5">
                              <Button
                                variant="primary"
                                style={{ cursor: 'default' }}
                              >
                                <Link
                                  to="/user-management"
                                  style={{ color: 'white' }}
                                >
                                  Go Back
                                </Link>
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default ViewUser;
