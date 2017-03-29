'use strict';

window.onscroll = () => {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById('gohome').style.display = 'block';
  } else {
    document.getElementById('gohome').style.display = 'none';
  }
}

//countdown clock
((id, time) => {

  //clock element
  const clock = document.getElementById(id);
  const days = clock.querySelector('#days');
  const hours = clock.querySelector('#hours');
  const minutes = clock.querySelector('#minutes');
  const seconds = clock.querySelector('#seconds');

  //update clock
  (function update() {
    const t = time - Date.now();

    //if time runs out stop updating the clock
    if (t <= 0) {
      return;
    }

    //pad all single digits with a leading zero
    days.innerHTML = ('0' + (Math.floor(t / (1000 * 60 * 60 * 24)))).slice(-2);
    hours.innerHTML = ('0' + (Math.floor((t / (1000 * 60 * 60)) % 24))).slice(-2);
    minutes.innerHTML = ('0' + (Math.floor((t / 1000 / 60) % 60))).slice(-2);
    seconds.innerHTML = ('0' + (Math.floor((t / 1000) % 60))).slice(-2);

    //update clock in 1 second
    setTimeout(update, 1000);
  })();

})('countdown', new Date(1496624400000));

//Form
function submit(e, cb) {
  if (!e.action || !e.method) { return; }
  
  const req = new XMLHttpRequest();
  
  req.onreadystatechange = function() {
    if (this.readyState === 4) {
      cb(this.status, this.responseText);
    }
  }
  
  let data = [];
    
  for (let i = 0; i < e.elements.length; i++) {
    const field = e.elements[i];

    if (!field.hasAttribute('name')) { 
      continue; 
    }
    
    const type = field.nodeName.toUpperCase() === 'INPUT' ? field.getAttribute('type').toUpperCase() : 'TEXT';
    data.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(type === 'RADIO' || type === 'CHECKBOX' ? field.checked : field.value));
  }
  
  data = data.join('&').replace(/%20/g, '+');
  
  if (e.method.toLowerCase() === 'post') {
    req.open('post', e.action);
    req.send(data);
  }
  
  if (e.method.toLowerCase() === 'get') {
    const action = e.action.replace(/(?:\?.*)?$/, '?' + data);
    req.open('get', action, true);
    req.send(null);
  }
}

const f = document.getElementById('form');

f.onsubmit = function (event) {
  event.preventDefault();
  const message = this.querySelector('.message');
  
  message.style.display = 'none';
  message.className = message.className.replace(' success', '').replace(' error', '');
  message.innerHTML = '';
  const name = this.querySelector('#name').value.trim();
  const phone = this.querySelector('#phone').value.trim();
  const email = this.querySelector('#email').value.trim();
  const guests = this.querySelector('#guests').value.trim();
  
  if (!name) {
    message.innerHTML += '"Name" is required<br>';
  }
  
  if (!email.match(/.+\@.+\..+/)) {
    message.innerHTML += '"Email" is not valid<br>';
  }
  
  if (this.querySelector('#yes').checked) {
    if (!phone) {
      message.innerHTML += '"Phone" is required<br>';
    }
    
    if (!guests || Number(guests) < 1) {
      message.innerHTML += '"How many people will be joining you?" is required<br>';
    }
  }
  
  if (message.innerHTML) {
    message.style.display = 'block';
    return;
  }
  
  submit(this, (statusCode, res) => {
    if (statusCode === 200) {
      message.className += ' success';
    } else if (statusCode !== 400) {
      message.className += ' error';
    }
    
    message.innerHTML = res;
    message.style.display = 'block';
  });
};

VMasker(document.querySelector('#phone')).maskPattern('(999) 999-9999');