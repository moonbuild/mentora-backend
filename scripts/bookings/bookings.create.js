const BASE_URL = 'http://localhost:3000';

// paste the access token here
const accessToken = '';

// paste the student ID here
const studentId = '';

// paste the lesson ID here
const lessonId = '';

(async () => {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ studentId, lessonId }),
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
})();