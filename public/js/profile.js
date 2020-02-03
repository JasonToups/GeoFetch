const token = localStorage.getItem('jwt');
const BASE = 'http://localhost:4000';

console.log('token',token);

// console.log($here);

if (!!token) {
  //send data to server
  
  fetch(`${BASE}/api/v1/profile`, {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${token}`,
    }
  })
    .then(res => res.json())
    .then((data) => {
      console.log('data',data);
      render(data);
    })
    .catch(err => console.log(err))
} else {
    window.location = '/login';
}


const render = (data) => {
  $('body').append(`<ul><li>${data._id}</li><li>${data.email}</li></ul>`)
}