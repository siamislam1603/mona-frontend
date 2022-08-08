import React, { useState, useEffect } from "react";
import { Col, Row, Dropdown } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import axios from "axios";
import moment from 'moment';


const AvailableTraining = ({ filter }) => {
  console.log('FILTER:', filter);
  const [availableTrainingData, setAvailableTrainingData] = useState();

  const fetchAvailableTrainings = async () => {
    console.log('INSIDE AVAILABLE TRAINING MODULE')
    let user_id = localStorage.getItem('user_id');
    console.log('USER ID:', user_id)
    console.log('URL:', `${BASE_URL}/training/assigeedTraining/${user_id}`);
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/training/assigeedTraining/${user_id}?category_id=${filter.category_id}&search=${filter.search}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if(response.status === 200 && response.data.status === "success") {
      console.log('RESPONSE:', response.data);
      const { searchedData } = response.data;
      setAvailableTrainingData(searchedData);
    }
  };

  // const filterData = (req, res, next) => {
  //   setFilteredData(availableTrainingData);

  //   let newData = availableTrainingData.filter(d => d.title.includes(searchTerm));
  //   setFilteredData(newData);
  // };

  useEffect(() => {
    fetchAvailableTrainings();
  }, [filter]);

  availableTrainingData && console.log('AVAILABLE DATA:', availableTrainingData);

  return (
    <>
      <div id="main">
        <div className="training-column">
          <Row>
          {availableTrainingData 
            ? availableTrainingData.map((item) => {
              return(
              <Col lg={4} md={6}>
                <div className="item mt-3 mb-3">
                  <div className="pic"><a href={`/training-detail/${item.id}`}><img src={item.coverImage} alt=""/> <span className="lthumb"><img src="../img/logo-thumb.png" alt=""/></span></a></div>
                  <div className="fixcol">
                    <div className="icopic"><img src="../img/traning-audio-ico1.png" alt=""/></div>
                    <div className="iconame">
                      <a href="/training-detail">{item.title}</a>
                      <div className="datecol">
                        <span className="red-date">Due Date:{' '}{moment(item.createdAt).format('DD/MM/YYYY')}</span>
                        <span className="time">{ item.completion_time } { item.completion_in}</span>
                      </div>
                    </div>
                    {
                      (localStorage.getItem('user_role') !== 'educator') &&
                       <div className="cta-col">
                        <Dropdown>
                          <Dropdown.Toggle variant="transparent" id="ctacol">
                            <img src="../img/dot-ico.svg" alt=""/>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#">Delete</Dropdown.Item>
                            <Dropdown.Item href={`/edit-training/${item.id}`}>Edit</Dropdown.Item>
                            <Dropdown.Item href="#">Share</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    }
                  </div>
                </div>
              </Col>
                );
              })
              : <div><p>No trainings assigned to you!</p></div>
              }
          </Row>
        </div>
      </div>
    </>
  );
};

export default AvailableTraining;
