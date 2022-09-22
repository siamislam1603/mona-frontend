import React, { useState, useEffect } from "react";
import { Col, Row, Dropdown } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from "axios";
import moment from 'moment';
import { FullLoader } from "../../components/Loader";

const CompleteTraining = ({ filter, setTabName }) => {
  const [completedTrainingData, setCompletedTrainingData] = useState([]);
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);

  const fetchCompletedTrainingData = async () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/${user_id}?category_id=${filter.category_id}&search=${filter.search}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      const { response: trainingList } = response.data;
      setfullLoaderStatus(false)
      setCompletedTrainingData(trainingList);
    }
  };  

  useEffect(() => {
    fetchCompletedTrainingData();
  }, []);
  useEffect(() =>{
    fetchCompletedTrainingData()
  },[filter.category_id, filter.search])


  useState(() => {
    setTabName('completed_training');
  }, [])

  return (
    <>
      <div id="main">
        <div className="training-column">
        <FullLoader loading={fullLoaderStatus} />

          <Row>
          {completedTrainingData.length>0 ? 
          (
            completedTrainingData?.map((item) => {
              return(
              <Col lg={4} md={6} key={item.id}>
                <div className="item mt-3 mb-3">
                  <div className="pic"><a href={`/training-detail/${item.training.id}`}><img src={`${item.training.coverImage}`} alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                  <div className="fixcol">
                    <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                    <div className="iconame">
                      <a href={`/training-detail/${item.training.id}`}>{item.training.title}</a>
                      <div className="datecol">
                        <span className="red-date">Completed on:{' '}{moment(item.createdAt).format('DD/MM/YYYY')}</span>
                        <span className="time">{ item.training.completion_time }</span>
                      </div>
                    </div>
                    {
                      (localStorage.getItem('user_role') !== 'coordinator' && localStorage.getItem('user_role') !== 'educator') &&
                      <div className="cta-col">
                        {
                          (localStorage.getItem('user_role') === 'franchisor_admin' ||
                          parseInt(localStorage.getItem('user_id')) === parseInt(item.training.user_id)) &&
                          <Dropdown> 
                            <Dropdown.Toggle variant="transparent" id="ctacol">
                            <img src="../img/dot-ico.svg" alt=""/>
                            </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item href="#">Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                      }
                      </div>
                    }
                  </div>
                </div>
              </Col>
                );
              })
          ):
          (
            <div className="text-center mb-5 mt-5">  <strong>{fullLoaderStatus === false? 'No training available.':""}</strong> </div>

          )
            
        }
          </Row>
        </div>
      </div>
    </>
  );
};

export default CompleteTraining;
