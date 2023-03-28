import React, { useCallback, useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { getAuthToken } from '../utils/commonMethods';
import axios from 'axios';
import moment from 'moment';
import { FullLoader } from '../components/Loader';

const useTrainingList = (user_id) => {
  const [trainingList, setTrainingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserTrainingDetails = useCallback(async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    };

    await axios
      .get(`http://localhost:4000/training/list/all/${user_id}`, config)
      .then((res) => {
        let { trainings } = res.data;
        setTrainingList(trainings);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('No Trainings Available');
        setIsLoading(false);
      });
  }, [user_id]);

  useEffect(() => {
    fetchUserTrainingDetails();
  }, [fetchUserTrainingDetails]);

  return { trainingList, isLoading, error };
};

const UserTraining = () => {
  const { userId } = useParams();
  let { trainingList: trainings, isLoading, error } = useTrainingList(userId);

  const columns = [
    {
      dataField: 'coverImage',
      text: 'Cover',
      formatter: (cell) => {
        console.log('cell:', cell);
        return (
          <>
            <div className="user-list">
              <span style={{ width: '100px', height: 'auto' }}>
                <img src={cell ? cell : '../img/upload.jpg'} alt="" />
              </span>
            </div>
          </>
        );
      },
    },
    {
      dataField: 'title',
      text: 'Name',
    },
    {
      dataField: 'start_date',
      text: 'Start Date',
      formatter: (cell) => {
        console.log('cell start date:', cell);
        let start_date = moment(cell).format('DD-MM-YYYY');
        return (
          <>
            <p>{start_date}</p>
          </>
        );
      },
    },
    {
      dataField: 'end_date',
      text: 'Due Date',
      formatter: (cell) => {
        console.log('cell due date:', cell);
        let due_date = cell ? moment(cell).format('DD-MM-YYYY') : 'No Due Date';
        return (
          <>
            <p>{due_date}</p>
          </>
        );
      },
    },
    {
      dataField: 'status',
      text: 'Status',
    },
    {
      dataField: 'training_id',
      text: 'Show More',
      formatter: (cell) => {
        return (
          <>
            <a style={{ color: '' }} href={`/training-detail/${cell}`}>
              show more
            </a>
          </>
        );
      },
    },
  ];

  console.log(trainings, isLoading, error);
  return (
    <>
      <div id="main" className="main-class">
        <section className="mainsection">
          <FullLoader loading={isLoading} />
          <Container>
            <div className="admin-wrapper">
              <div className="sec-column">
                <div className="entry-container">
                  <div className="user-management-sec user-training">
                    {error === null ? (
                      <>
                        <BootstrapTable
                          keyField="id"
                          data={trainings}
                          columns={columns}
                        />
                      </>
                    ) : (
                      <p
                        style={{
                          textAlign: 'center',
                          color: '#888',
                          fontWeight: 'normal',
                          fontSize: '18px',
                        }}
                      >
                        {error}
                      </p>
                    )}
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

export default UserTraining;
