import { useEffect, useState, useRef, useCallback } from 'react';
import { getAuthToken } from '../../../../utils/commonMethods';
import { getCommonUserDataAPI } from './ProfileAPI';
import axios from 'axios';

export const FetchCommonDataForUser = (props) => {
  // TO CANCEL API REQUEST IF THE PAGE CHANGES
  const abortControllerRef = useRef(new AbortController());

  const [userRoleData, setUserRoleData] = useState([]);
  const [franchiseeData, setFranchiseeData] = useState(null);
  const [trainingCategoryData, setTrainingCategoryData] = useState([]);
  const [pdcData, setPdcData] = useState([]);
  const [businessAssetData, setBuinessAssetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAPIData = useCallback(async () => {
    let apiArray = getCommonUserDataAPI();
    let config = {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    };

    let requests = apiArray.map((item) =>
      axios.get(item, config, abortControllerRef)
    );

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
    const controller = abortControllerRef.current;
    fetchAPIData();

    return () => {
      controller.abort();
    };
  }, [fetchAPIData]);

  return {
    userRoleData,
    trainingCategoryData,
    pdcData,
    businessAssetData,
    franchiseeData,
    isLoading,
  };
};
