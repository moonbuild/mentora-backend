const BASE_URL = 'http://localhost:3000';

(async () => {
  const response = await fetch(`${BASE_URL}/health`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
})();