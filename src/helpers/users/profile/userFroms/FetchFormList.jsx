import { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import { getAuthToken } from '../../../../utils/commonMethods';
import { getUserFormsAPI } from './userFormAPI';

export const FetchFormList = ({ userId, userRole }) => {
  const abortControllerRef = useRef(new AbortController());
  const [formList, setFormList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserFormDetails = useCallback(async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    };

    await axios
      .get(getUserFormsAPI({ userId, userRole }), config, abortControllerRef)
      .then((res) => {
        let { forms } = res.data;
        setFormList(forms);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('No Forms Available');
        setIsLoading(false);
      });
  }, [userId, userRole]);

  useEffect(() => {
    const controller = abortControllerRef.current;
    fetchUserFormDetails();

    return () => {
      controller.abort();
    };
  }, [fetchUserFormDetails]);

  return { formList, isLoading, error };
};

export const GetFromListColumns = (navigate) => {
  return [
    {
      dataField: 'form_name',
      text: 'Form Name',
    },
    {
      dataField: 'form_category',
      text: 'Category',
    },
    {
      dataField: 'count',
      text: 'Total Response',
    },
    {
      dataField: 'creation_date',
      text: 'Created On',
      formatter: (cell) => {
        let created_on = moment(cell).format('DD-MM-YYYY');
        return (
          <>
            <p>{created_on}</p>
          </>
        );
      },
    },
    {
      dataField: 'id',
      text: 'Action',
      formatter: (cell) => {
        return (
          <>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(`/form/response/${cell}`)}
            >
              View Responses
            </button>
          </>
        );
      },
    },
  ];
};
