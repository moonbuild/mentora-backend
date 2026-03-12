const url = `http://localhost:3000`;
interface RefreshToken {
  accessToken: string;
  refreshToken: string;
}

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

const userPayload = {
  username: 'moonbuild13',
  password: 'Mourya123@',
  role: 'parent',
  first_name: 'Mourya11',
  last_name: 'Pranay',
};

const testAuthFlow = async () => {
  try {
    console.log('Signup running');
    const signupResponse = await fetch(url.concat('/auth/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload),
    });
    const signupData = await signupResponse.json();
    console.log(' testAuthFlow ~ signupdata:', signupData);

    console.log('Login running');
    const loginResponse = await fetch(url.concat('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload),
    });

    const loginData = (await loginResponse.json()) as RefreshToken;
    console.log(' testAuthFlow ~ logindata:', loginData);

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
    const authData = (await refreshResponse.json()) as RefreshToken;
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

const studentPayload = {
  username: 'student12',
  password: 'Mourya123@',
  first_name: 'Student',
  last_name: 'book',
};

const testParentStudentFlow = async () => {
  try {
    const parentData = userPayload;

    console.log('Parent Logging in');
    const loginRes = await fetch(`${url}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: parentData.username, password: parentData.password }),
    });
    const loginData = (await loginRes.json()) as RefreshToken;
    const token = loginData.accessToken;
    console.log('Token:', token ? 'Received' : 'Missing');

    console.log('Creating Student');
    const createStudentRes = await fetch(`${url}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studentPayload),
    });

    const createStudentData = await createStudentRes.json();
    console.log('Created Student:', createStudentData);

    console.log('Get all Students linked to Parent');
    const getStudentsRes = await fetch(`${url}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const students = await getStudentsRes.json();
    console.log('All Students:', students);

    console.log(' GET /students without token (expect 401)');
    const noAuthRes = await fetch(`${url}/students`);
    console.log('No auth status:', noAuthRes.status);
  } catch (err) {
    console.error('Test failed:', err);
  }
};

const mentorPayload = {
  username: 'mentor6',
  password: 'Mourya123@',
  role: 'mentor',
  first_name: 'Mourya',
  last_name: 'Pranay',
};

const lessonPayload = {
  title: 'Introduction to Algebra',
  description: 'Basic algebraic concepts and equations.',
};

const sessionPayload = {
  topic: 'Solving for X',
  date: new Date().toISOString(),
  summary: 'Students will learn how to isolate variables.',
};

const testLessonSessionFlow = async () => {
  try {
    console.log('Starting Lesson & Session Flow Test');

    console.log('Signing up Mentor...');
    await fetch(`${url}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mentorPayload),
    });

    console.log('Mentor Logging in...');
    const loginRes = await fetch(`${url}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: mentorPayload.username,
        password: mentorPayload.password,
      }),
    });

    const loginData = (await loginRes.json()) as RefreshToken;
    const token = loginData.accessToken;
    console.log('Mentor Token:', token ? 'Received' : 'Missing');

    if (!token) throw new Error('Mentor login failed, stopping test.');

    console.log('POST Creating Lesson...');
    const createLessonRes = await fetch(`${url}/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lessonPayload),
    });

    const lessonData = (await createLessonRes.json()) as { lesson_id: string; id: string };
    console.log('Created Lesson Response:', lessonData);

    const lessonId = lessonData.lesson_id || lessonData.id;

    console.log('GET fetching all Mentor Lessons...');
    const getLessonsRes = await fetch(`${url}/lessons`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const lessonsData = await getLessonsRes.json();
    console.log('Mentor Lessons Array:', lessonsData);

    if (lessonId) {
      console.log(`POST Creating Session for Lesson ID: ${lessonId}...`);
      const createSessionRes = await fetch(`${url}/lessons/${lessonId}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionPayload),
      });
      const sessionData = await createSessionRes.json();
      console.log('Created Session Response:', sessionData);

      console.log(`GET Fetching Sessions for Lesson ID: ${lessonId}...`);
      const getSessionsRes = await fetch(`${url}/lessons/${lessonId}/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessionsArray = await getSessionsRes.json();
      console.log('Lesson Sessions Array:', sessionsArray);
    } else {
      console.error(
        'Skipping session tests: Failed to retrieve a valid lessonId from the lesson creation response.',
      );
    }
  } catch (err) {
    console.error('Lesson/Session Test failed:', err);
  }
};

const testBookingFlow = async () => {
  try {
    console.log('Starting booking flow test');

    console.log('Parent Logging in...');
    const loginRes = await fetch(`${url}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userPayload.username,
        password: userPayload.password,
      }),
    });

    const loginData = (await loginRes.json()) as RefreshToken;
    const parentToken = loginData.accessToken;
    console.log('Parent Token:', parentToken ? 'Received' : 'Missing');

    // now get the studentid
    console.log('Fetching Students linked to parent...');
    const studentsRes = await fetch(`${url}/students`, {
      headers: { Authorization: `Bearer ${parentToken}` },
    });
    // take one studentid
    const students = (await studentsRes.json())as {user_id:string}[];
    const studentId = students[0]?.user_id;
    console.log('Target Student ID:', studentId);

    // among all lessons we will create a 
    console.log('Fetching available Lessons...');
    const lessonsRes = await fetch(`${url}/lessons`, {
      headers: { Authorization: `Bearer ${parentToken}` },
    });
    const lessons = await lessonsRes.json() as {lesson_id:string}[];
    const lessonId = lessons[0]?.lesson_id;
    console.log('Target Lesson ID:', lessons);

    if (!studentId || !lessonId) {
      throw new Error('Pre requisites missing: Need at least one student and one lesson.');
    }

    console.log('POST Creating Booking (Assigning Student to Lesson)');
    const bookingPayload = { studentId, lessonId };
    const createBookingRes = await fetch(`${url}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`,
      },
      body: JSON.stringify(bookingPayload),
    });
    const bookingData = await createBookingRes.json();
    console.log('testBookingFlow ~ bookingData:', bookingData);

    console.log('Testing Duplicate Booking (should fail)...');
    const duplicateRes = await fetch(`${url}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`,
      },
      body: JSON.stringify(bookingPayload),
    });
    const duplicateData = await duplicateRes.json();
    console.log('Duplicate booking response:', duplicateData);

    console.log('GET Fetching Booking history...');
    const historyRes = await fetch(`${url}/bookings`, {
      headers: { Authorization: `Bearer ${parentToken}` },
    });
    const historyData = await historyRes.json();
    console.log('🚀 ~ testBookingFlow ~ historyData:', historyData);

    console.log('Student Logging in to check history...');
    const sLoginRes = await fetch(`${url}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: studentPayload.username,
        password: studentPayload.password,
      }),
    });
    const sLoginData = (await sLoginRes.json()) as RefreshToken;
    const studentToken = sLoginData.accessToken;

    console.log('GET Student fetching their own bookings...');
    const studentHistoryRes = await fetch(`${url}/bookings`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const studentHistoryData = await studentHistoryRes.json();
    console.log('Student History View:', studentHistoryData);
  } catch (err) {
    console.error('Booking Flow Test failed:', err);
  }
};

generalTest();
testAuthFlow().then(()=>testParentStudentFlow()).then(()=>testLessonSessionFlow()).then(()=>testBookingFlow());
// testBookingFlow();