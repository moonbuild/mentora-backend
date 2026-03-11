const url = `http://localhost:3000`;
const generalTest = async () => {
  console.log('Testing base url');
  const serverStatus = await fetch(url);
  const serverResponse = await serverStatus.json();
  console.log('base url response: ', serverResponse);

  console.log('Testing health endpoint');
  const healthRaw = await fetch(url.concat('/health'));
  const healthResponse = await healthRaw.json();
  console.log('/health response: ', healthResponse);
};
const tasksTest = async () => {
  const title = 'title5';
  const description = 'loream ipsum';
  console.log('Creating task: ');
  const createTaskRaw = await fetch(url.concat('/tasks'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });
  const currentTask = await createTaskRaw.json();
  console.log('current task row: ', currentTask);

  console.log('Fetching All Tasks');
  const res = await fetch(url.concat('/tasks'));
  const tasks = await res.json();
  console.log('All tasks: ', tasks);
};

const testAuthFlow = async () => {
  try {
    const data = {
      username: 'moonbuild6',
      password: 'Mourya123@',
      role: 'student',
      first_name: 'Mourya6',
      last_name: 'Pranay',
    };
    console.log('Signup running');
    const signupResponse = await fetch(url.concat('/auth/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const signupData = await signupResponse.json();
    console.log('🚀 ~ testAuthFlow ~ signupdata:', signupData);

    console.log('Login running');
    const loginResponse = await fetch(url.concat('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const loginData = (await loginResponse.json()) as { accessToken: string; refreshToken: string };
    console.log('🚀 ~ testAuthFlow ~ logindata:', loginData);

    console.log('Refresh Token running');
    const refreshResponse = await fetch(url.concat('/auth/refresh'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: loginData.refreshToken,
      }),
    });
    const authData = (await refreshResponse.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    console.log('🚀 ~ testAuthFlow ~ authData:', authData);
    const accessToken = authData.accessToken;

    // lets try accessing protected route
    const userRaw1 = await fetch(`${url}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    const userResponse1 = await userRaw1.json();

    console.log(' ~  protected route with access token: ', userResponse1);
    const userRaw2 = await fetch(`${url}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const userResponse2 = await userRaw2.json();
    console.log(' ~  protected route without! access token: ', userResponse2);
  } catch (error) {
    console.error(error);
  }
};
generalTest();
tasksTest();
testAuthFlow();
