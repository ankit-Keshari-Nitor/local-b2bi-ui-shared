
export const authenticateUser = async (data) => {
  console.log(data, 'data');
  
  //Test with dummy json url
  fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        // username: data.userId,
        // password: data.password,
        username: 'emilys',
        password:'emilyspass',
      expiresInMins: 30, // optional, defaults to 60
    })
  })
  .then(res => res.json())
  .then(console.log);
};

