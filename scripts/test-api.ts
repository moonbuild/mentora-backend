
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
