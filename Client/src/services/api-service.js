const BASE_API_URL = 'https://truemuz-func-httptriggers.azurewebsites.net';

export const getBandInfoByName = async (name) => {
  const response = await fetch(`${BASE_API_URL}/api/Artist/${name}?code=truemuz-test`);
  const data = await response.json();

  return data;
};