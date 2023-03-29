import ImageCropPopup from '../components/ImageCropPopup/ImageCropPopup';
import React, { useState } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isUserAllowed } from '../utils/commonMethods';
import DragDropSingle from '../components/DragDropSingle';
import { FullLoader } from '../components/Loader';
import { FetchCommonDataForUser } from '../helpers/users/profile/personalDetails/FetchCommonDataForUser';
import { FetchUserData } from '../helpers/users/profile/personalDetails/FetchUserData';
import {
  isUserNoteAvailable,
  canViewUserNote,
  populateUserRole,
  populateUserPhone,
  populateUserFranchise,
  populateUserPDC,
  populateUserTrainingCategoryData,
  populateUserBusinessAssets,
  populateCoordinator,
} from '../helpers/users/profile/personalDetails/commonUserFunctions';

const ViewUser = () => {
  const { userId } = useParams();
  const [image, setImage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const { formData, croppedImage, coordinatorData } = FetchUserData(userId);
  const {
    userRoleData,
    trainingCategoryData,
    pdcData,
    businessAssetData,
    franchiseeData,
    isLoading,
  } = FetchCommonDataForUser();

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
                          onSave={setImage}
                          setPopupVisible={setPopupVisible}
                          fetchedPhoto={formData?.profile_photo || ''}
                        />

                        {popupVisible && (
                          <ImageCropPopup
                            image={image}
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
                              <p>
                                {populateUserTrainingCategoryData(
                                  trainingCategoryData,
                                  formData?.trainingCategories
                                )}
                              </p>
                            </Form.Group>
                          )}

                          {formData && formData?.role !== 'guardian' && (
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>
                                Professional Development Categories
                              </Form.Label>
                              <p>
                                {populateUserPDC(
                                  pdcData,
                                  formData?.professionalDevCategories
                                )}
                              </p>
                            </Form.Group>
                          )}

                          <Form.Group className="col-md-6 mb-3 relative">
                            <Form.Label>Contact Number</Form.Label>
                            <div className="tel-col">
                              <p>
                                {populateUserPhone(
                                  formData?.telcode,
                                  formData?.phone
                                )}
                              </p>
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
                              <p>
                                {populateCoordinator(
                                  coordinatorData,
                                  formData?.coordinator
                                )}
                              </p>
                            </Form.Group>
                          )}

                          {formData && formData?.role !== 'guardian' && (
                            <Form.Group className="col-md-6 mb-3 relative">
                              <Form.Label>Business Assets</Form.Label>
                              <p>
                                {populateUserBusinessAssets(
                                  businessAssetData,
                                  formData?.businessAssets
                                )}
                              </p>
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
