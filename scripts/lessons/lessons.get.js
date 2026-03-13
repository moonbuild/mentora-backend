const BASE_URL = 'http://localhost:3000';

// paste the access token here
const accessToken = '';

(async () => {
  const response = await fetch(`${BASE_URL}/lessons`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
})();