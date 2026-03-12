
async function login() {
  const API_URL = 'http://localhost:3000/auth/login';

  const parentPayload = {
    username: 'moonbuild',
    password: 'Mourya123@',
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parentPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Error (${response.status}):`, data.error);
      return;
    }

    console.log('--- Login Successful ---');
    console.log('User:', data);

  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

login();