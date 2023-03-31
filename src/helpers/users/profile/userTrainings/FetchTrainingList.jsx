import { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import { getAuthToken } from '../../../../utils/commonMethods';
import { getUserTrainingsAPI } from './userTrainingAPI';

function getUiniqueTrainingData(data) {
  let uniqueIds = [];
  data = data.map((item) => {
    if (!uniqueIds.includes(item.training_id)) {
      uniqueIds.push(item.training_id);
      return item;
    }
  });

  data = data.filter((item) => typeof item !== 'undefined');
  return data;
}

export const FetchTrainingList = ({ userId, search }) => {
  const abortControllerRef = useRef(new AbortController());
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
      .get(getUserTrainingsAPI({ userId, search }), config, abortControllerRef)
      .then((res) => {
        let { trainings } = res.data;
        trainings = getUiniqueTrainingData(trainings);
        setTrainingList(trainings);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('No Trainings Available');
        setIsLoading(false);
      });
  }, [userId, search]);

  useEffect(() => {
    const controller = abortControllerRef.current;
    fetchUserTrainingDetails();

    return () => {
      controller.abort();
    };
  }, [fetchUserTrainingDetails]);

  return { trainingList, isLoading, error };
};

export const GetTrainingListColumns = (navigate) => {
  return [
    {
      dataField: 'coverImage',
      text: 'Cover',
      formatter: (cell) => {
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
      text: 'Training Name',
    },
    {
      dataField: 'start_date',
      text: 'Start Date',
      formatter: (cell) => {
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
      text: 'Progress',
    },
    {
      dataField: 'is_expired',
      text: 'Status',
      formatter: (cell) => {
        let statusStyle =
          cell === 'Available'
            ? {
                backgroundColor: 'limegreen',
              }
            : { backgroundColor: 'tomato' };
        return (
          <>
            <div
              style={{
                width: '6rem',
                height: '0.8rem',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <p style={statusStyle}>{cell}</p>
            </div>
          </>
        );
      },
    },
    {
      dataField: 'training_id',
      text: 'Show More',
      formatter: (cell) => {
        return (
          <>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(`/training-detail/${cell}`)}
            >
              View More
            </button>
          </>
        );
      },
    },
  ];
};
