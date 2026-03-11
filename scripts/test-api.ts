const url = `http://localhost:3000`;

const fetchServerStatus = async () => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const fetchHealth = async () => {
  const res = await fetch(url.concat('/health'));
  const data = await res.json();
  return data;
};
// fetchServerStatus().then((res) => console.log(res));
// fetchHealth().then((res) => console.log(res));

const createTask = async (title: string, description: string) => {
  const res = await fetch(url.concat('/tasks'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });
  const data = await res.json();
  return data;
};

const fetchTasks = async () => {
  const res = await fetch(url.concat('/tasks'));
  return await res.json();
};

// createTask('title4', 'loream ipsum').then((res) => console.log(res));
// fetchTasks().then((res) => console.log(res));

const testAuthFlow = async () => {
  try {
    const data = {
      username: 'moonbuild6',
      password: 'Mourya123@',
      role: 'student',
      first_name: 'Mourya6',
      last_name: 'Pranay',
    };
    console.log("Signup running");
    const signupResponse = await fetch(url.concat('/auth/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const signupData = await signupResponse.json();
    console.log("🚀 ~ testAuthFlow ~ signupdata:", signupData);

    console.log("Login running");
    const loginResponse = await fetch(url.concat('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const loginData = (await loginResponse.json()) as { accessToken: string; refreshToken: string };;
    console.log("🚀 ~ testAuthFlow ~ logindata:", loginData);
    
    console.log("Refresh Token running");
    const refreshResponse = await fetch(url.concat('/auth/refresh'), {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
              body:JSON.stringify({
          refreshToken:loginData.refreshToken
        })
    })
    const authData = (await refreshResponse.json()) as { accessToken: string; refreshToken: string };
    console.log("🚀 ~ testAuthFlow ~ authData:", authData)
    const accessToken = authData.accessToken;
    // lets try accessing protected route
    const protectedRes = await fetch(`${url}/auth/protected`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',

      },
    });
    const statusData = await protectedRes.json();
    console.log(' ~  protected route with access token: ', statusData);
       const protectedResWithoutToken = await fetch(`${url}/auth/protected`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const withoutAccessTokenData = await protectedResWithoutToken.json();
    console.log(' ~  protected route with access token: ', withoutAccessTokenData);
  } catch (error) {
    console.error(error);
  }
};

testAuthFlow();
// const signup = async ()=>{
//     // this is post operation
//     const response = await fetch(url.concat("/auth/signup"), {
//         method:'POST',
//         headers:{
//             'Content-Type':'application/json'
//         },
//         body:JSON.stringify(data)
//     });
//     console.log(data, JSON.stringify(data));
//     const res = await response.json()
//     return res;
// }
// const login = async ()=>{
//     const data = {username:"moonbuild", password:"Mourya123@"};
//     // this is post operation
//     const response = await fetch(url.concat("/auth/login"),{
//         method:'POST',
//         headers:{
//             'Content-Type':'application/json',
//         },
//         body:JSON.stringify(data)
//     });
//     const res = await response.json()
//     return res;
// }
// signup().then(r=>console.log(r));
// // login().then(r=>console.log(r));