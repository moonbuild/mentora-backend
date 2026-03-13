const BASE_URL = 'http://localhost:3000';

// paste the access token here
const accessToken = '';

(async () => {
  const response = await fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      username: 'student3',
      password: 'Mourya123@',
      first_name: 'Student',
      last_name: 'Book',
    }),
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
})();