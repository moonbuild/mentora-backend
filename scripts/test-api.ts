const url = `http://localhost:3000`;

const fetchServerStatus = async () => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
fetchServerStatus().then((res) => console.log(res));

const fetchHealth = async () => {
  const res = await fetch(url.concat('/health'));
  const data = await res.json();
  return data;
};
fetchHealth().then((res) => console.log(res));

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

createTask('title3', 'loream ipsum').then((res) => console.log(res));
fetchTasks().then((res) => console.log(res));
