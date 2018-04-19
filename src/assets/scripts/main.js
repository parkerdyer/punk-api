/**
 * Dynamit Code Day Punk API
 */

// Punk API endpoint
const API_ENDPOINT = 'https://api.punkapi.com/v2/beers';

const button = document.querySelector('button');
const app = document.getElementsByClassName('beers');


var request = new XMLHttpRequest();

request.open('GET', API_ENDPOINT, true);
request.onload = function () {


  var data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
    data.forEach(beers => {
        button.addEventListener("click",
            function(e) {
                e.preventDefault();
                document.querySelector('.beers').appendChild(container);
                button.remove();
                return false;
            }
        ,false);

      const container = document.createElement('div');
      container.setAttribute('class', 'container');

      const card = document.createElement('div');
      card.setAttribute('class', 'card');

      const img = document.createElement('img');
      img.src = beers.image_url;

      const h2 = document.createElement('h2');
      h2.textContent = beers.name;

      const p = document.createElement('p');
      p.textContent = `${beers.abv}%`;


      container.appendChild(card);
      card.appendChild(img);
      container.appendChild(h2);
      container.appendChild(p);

    });
  } else {
    const errorMessage = alert('It\'s not working!');

  }
}

request.send();




console.log('We Werkin\'');
