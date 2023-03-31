import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getAuthToken } from '../../../../utils/commonMethods';
import { getFormResponseAPI } from './formResponseAPI';

export const FetchFormResponse = ({ formId, search }) => {
  const [formDetails, setFormDetails] = useState(null);
  const [formResponse, setFormResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFormResponses = useCallback(async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    };

    await axios
      .get(getFormResponseAPI({ formId, search }), config)
      .then((response) => {
        let { formResponse: userFormResponse, formDetails } = response.data;
        setFormDetails(formDetails);
        setFormResponse(userFormResponse);
        setIsLoading(false);
      })
      .catch((error) => {
        setError('No Resonse Found');
        setIsLoading(false);
      });
  }, [formId, search]);

  useEffect(() => {
    fetchFormResponses();
  }, [fetchFormResponses]);

  return { formDetails, formResponse, error, isLoading };
};
