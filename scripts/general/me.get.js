const BASE_URL = 'http://localhost:3000';

// paste the access token here
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNmRiMTMyNi1hZGIyLTRkZWItYTExMi00OWRkMjMyZTRkYTUiLCJyb2xlIjoicGFyZW50IiwianRpIjoiOGRhNjZhYTUtNzVjNy00MGRjLWI1MTQtNTkzOTFiNzgzNmYzIiwiaWF0IjoxNzczMzc5MTk3LCJleHAiOjE3NzMzODI3OTd9.VGa-2zns_c-lDifm3OKPeJJOaqcMr2rBj4ga-GLiMX0';

(async () => {
  const response = await fetch(`${BASE_URL}/me`, {
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