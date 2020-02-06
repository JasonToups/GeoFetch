const token = localStorage.getItem('jwt');
// console.log(token);
fetch(`/api/v1/list/index`, {
  method: 'GET',
  headers: {
    'content-Type': 'application/json',
    'authorization': `bearer ${token}`,
  },
  // body: JSON.stringify(listData),
})
  .then(res => res.json())
  .then((data) => {
    console.log('data', data);
    render(data);
  })
  .catch(err => console.log(err))


const render = (data)=> {
  for (let i = 0; i < data.length; i++) {
    const list = data[i];
    $('#list-group').append(`<form><li id="list${i+1}">${list.listTitle}<ul class="items list-unstyled" style="display: none;">
  </ul></li><button class="btn-primary">save</button></form>`)
    for (let j = 0; j < data[i].item.length; j++) {
      const item = data[i].item[j];
      $(`#list${i+1} > ul`).append(`<li>
      <div class="form-check">
        <input type="checkbox" class="form-check-input">
        <input id="item${i}" type="text" value="${item.itemName}" required="true">
        <a href="" class="float-right delItem">delete</a>
      </div>
    </li>`)
    }
  }
}



$('ul').on('click', 'li', ()=>{
  // console.log($('ul ul'));
  $(event.target).children().toggle();

})