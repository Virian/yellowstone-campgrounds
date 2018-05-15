import axios from 'axios';
import {URLS} from '../config';

const RestClient = (() => {
	const apiPath = 'http://localhost:4000/api';
	const {
    testPath,
  } = URLS;

  const doGet = (url, params) => {
    return axios.get(apiPath + url, {
      params: params
    })
  };

  const doPost = (url, data) => {
    return axios.post(apiPath + url, data);
  };

  // methods
  const getTestPath = () => {
    return doGet(testPath, {});
  }

  return {
		getTestPath: getTestPath,
  };
})();

export default RestClient;
