const BASE = 'http://localhost:4000';
const $form = $('form');
const token = localStorage.getItem('jwt');

let url = new URL(window.location.href.toString());
let query_string = url.search;
let search_params = new URLSearchParams(query_string);
let listId = search_params.get('id');

fetch(`/api/v1/list/detail/${listId}`, {
  method: 'GET',
  headers: {
    'content-Type': 'application/json',
    'authorization': `bearer ${token}`,
  },
})
  .then(res => res.json())
  .then((data) => {
    const list = data.data;
    render(list);
  })
  .catch(err => console.log(err))



const render = (list) => {
  $form.append(`
<div class="form-group">
    <label for="listTitle">List Title</label>
    <input type="text" class="form-control" id="listTitle" placeholder="Enter list title" name="listTitle" value="${list.listTitle}">
  </div>
  <div class="form-group">
    <label for="dateDue">Due date</label>
    <input type="date" class="form-control" id="dateDue" name="dateDue" value="${list.dateDue}">
  </div>
  <!-- Autocomplete location search input -->
      <div class="form-group">
        <label>Location:</label>
        <input type="text" class="form-control" id="locationName" placeholder="Type address..." name="locationName" value="${list.location.locationName}"/>
        <input type="hidden" id="latitude" name="latitude"/>
        <input type="hidden" id="longitude" name="longitude"/>
      </div>
      <!-- Display latitude and longitude -->
      <div class="latlong-view">
        <p><b>Latitude:</b> <span id="latitude_view">${list.location.latitude}</span></p>
        <p><b>Longitude:</b> <span id="longitude_view">${list.location.longitude}</span></p>
      </div>
  <ul class="list-unstyled itemList">
    <div>Item</div>
    
  </ul>
  
  <button type="submit" class="save btn-primary float-right" style="display: none">Save</button>
  <button class="delete btn-secondary float-right">Delete</button>
`)

  const itemList = list.item;
  for (let i = 0; i < itemList.length; i++) {
    const item = itemList[i];

    if (i === itemList.length - 1) {
      $('.itemList').append(`<li>
    <div class="form-check">
      <input type="checkbox" class="form-check-input">
      <input id="item${i}" type="text" value="${item.itemName}" required="true">
      <a href="" class="float-right delItem">delete</a>
    </div>
    <button class="addItem">+</button>
  </li>`)
    } else {
      $('.itemList').append(`<li>
  <div class="form-check">
    <input type="checkbox" class="form-check-input">
    <input id="item${i}" type="text" value="${item.itemName}" required="true">
    <a href="" class="float-right delItem">delete</a>
  </div>
</li>`)
    }
    const id = `item${i}`;
    if (item.status === "false") {
      $('id').prev().removeProp('checked');
    } else {
      $('id').prev().prop('checked');
    }
  }

  $('.itemList').on('click', '.delItem', () => {
    event.preventDefault();
    $(event.target).parent().remove();
    $('button').css('display', '');
  })


  const $addBtn = $('.addItem');
  const $addItemlist = $('.itemList');

  $addItemlist.on('click', '.addItem', () => {
    event.preventDefault();
    $addItemlist.append(`<li>
  <div class="form-check">
    <input type="checkbox" class="form-check-input">
    <input type="text" class="blank" required="true">
    <a href="" class="float-right delItem">delete</a>
  </div> 
  <button class="addItem">+</button>
</li>`)
    $(event.target).remove();
  })
}







/* Delete list */
$form.on('click', '.delete', () => {
  if (confirm('Are you sure you want to delete the list?')) {
    fetch(`/api/v1/list/detail/${listId}`, {
      method: 'DELETE',
      headers: {
        'content-Type': 'application/json',
      },
      // body: JSON.stringify(listData),
    })
      .then(res => res.json())
      .then((data) => {
        window.location = '/';

      })
      .catch(err => console.log(err))
  }
})
$form.on('click', 'input', () => {
  $('button').css('display', '');

  let searchInput = 'locationName';
  var autocomplete;
  autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
    types: ['geocode'],
    componentRestrictions: {
      country: "USA",
    },
    radius: '500'
  });
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    var near_place = autocomplete.getPlace();
    document.getElementById('latitude').value = near_place.geometry.location.lat();
    document.getElementById('longitude').value = near_place.geometry.location.lng();
    document.getElementById('latitude_view').innerHTML = near_place.geometry.location.lat();
    document.getElementById('longitude_view').innerHTML = near_place.geometry.location.lng();

  });

  $('#searchInput').on('keyup', () => {
    document.getElementById('latitude_input').value = '';
    document.getElementById('longitude_input').value = '';
    document.getElementById('latitude_view').innerHTML = '';
    document.getElementById('longitude_view').innerHTML = '';
  })
  /* ------ */
})



/* Update */
const clearAlertMessage = () => {
  document.querySelectorAll('.alert').forEach(ele => {
    ele.remove();
  })
  document.querySelectorAll('.input').forEach(ele => {
    ele.removeClass();
  })
}

const $save = $('.save');
//submiting update form
$form.on('submit', () => {
  clearAlertMessage();
  event.preventDefault();
  const listData = {};
  const list = {};
  const location = {};
  const items = [];
  const $formEle = $form.prop('elements');
  const formInput = [...$formEle];

  let formIsValid = true;
  //check valid and filter out button
  for (let i = 0; i < formInput.length; i++) {
    if (formInput[i].tagName === 'BUTTON') {
      formInput.splice(i, 1);
    } else if (formInput[i].className === 'form-check-input') {
      // formInput[i].prop('value',formInput[i].checked);
    } else if (formInput[i].value === '') {
      formIsValid = false;
      formInput[i].classList.add('input-error');
      formInput[i].insertAdjacentHTML('afterend', `<div class="alert">Please enter valid information</div>`)
    }

  }

  const toDo = formInput.slice(0, 2);
  const loca = formInput.slice(2, 5);
  const it = formInput.slice(5, formInput.length - 1);

  toDo.forEach(input => {
    list[`${input.id}`] = input.value;
  })
  loca.forEach(input => {
    location[`${input.id}`] = input.value;
  })

  for (let i = 0; i < it.length; i++) {
    const itemObj = {}
    if (i % 2 === 0) {
      itemObj.status = it[i].checked;
      itemObj.itemName = it[i + 1].value;
      items.push(itemObj);
    }

  }

  // listData.id = listId;
  listData.list = list;
  listData.location = location;
  listData.items = items;

  //fetch list
  if (formIsValid) {
    //send data to server
    fetch(`${BASE}/api/v1/list/detail/${listId}`, {
      method: 'PUT',
      headers: {
        'content-Type': 'application/json',
      },
      body: JSON.stringify(listData),
    })
      .then(res => res.json())
      .then((data) => {
        console.log('data', data);
      })
      .catch(err => console.log(err))
  }

  $('.blank').removeClass('blank')
  $('.save').css('display', 'none');

})



