const requestURL = 'https://api.unsplash.com/search/photos?page=1&per_page=20&client_id=Dn8-42Jk1UNg4-nIQbG_xlewlntyxqNTU2laqw9yWCs';
const randomImages = 'https://api.unsplash.com/photos/random/?client_id=Dn8-42Jk1UNg4-nIQbG_xlewlntyxqNTU2laqw9yWCs&count=100';
const searchImages = document.querySelector('form');
const input = document.querySelector('input');
const images = document.querySelector('.images');


function searchStart() {
    images.innerHTML = '';
    input.value = '';
}

fetch(randomImages)
    .then(response => response.json())
    .then(data => {
        if(data) {
            data.forEach(item => {
                images.innerHTML += showRandomImages(item)
            });
        }
    })

function showRandomImages(data) {
    return `
        <div class="data">
            <img src='${data.urls.regular}'>
            <a href='${data.links.html}' target='_blank' class='user'>Photo by: ${data.user.name ? data.user.name : ''}</a>
        </div>
    `
}

function search(searchImg) {
    let url = `${requestURL}&query=${searchImg}`;
    return fetch(url)
        .then(response => response.json())
        .then(result => {
            return result.results;
        });
}

function showImages(data) {
    images.innerHTML = '';
    data.forEach(item => {
        let image = document.createElement('div');
        image.className = 'showImage';
        image.innerHTML = `
        <img src='${item.urls.regular}'>
        <a href='${item.links.html}' target='_blank' class='user'>Photo by: ${item.user.name ? item.user.name : ''}</a>
        `
        images.appendChild(image);
        
    });
}

searchImages.addEventListener('submit', (event) => {
    if (input.value === '') {
        alertify.error('Enter the title!')
    } 
    event.preventDefault();
    let searchImg = input.value;
    searchStart();  
    search(searchImg)
        .then(showImages)   
});

images.addEventListener('click', function(ev) {
    if(ev.target.tagName !== 'IMG') return false;
    let target = ev.target,
              width,
              height,
              ratio = Math.min(target.naturalWidth, window.innerWidth) / Math.min(target.naturalHeight, window.innerHeight);
    let bigImage = images.appendChild(document.createElement('DIV'));
    let imagesRect = images.getBoundingClientRect(),
           imgRect = target.getBoundingClientRect();
      
      document.body.classList.add('show');
      
    bigImage.style.top = `${imgRect.y - imagesRect.y}px`; 
    bigImage.style.left = `${imgRect.x - imagesRect.x}px`;
    bigImage.style.width = `${imgRect.width}px`;
    bigImage.style.height = `${imgRect.height}px`;
      
    if(window.innerHeight < window.innerWidth) {
      height = window.innerHeight;
          width = height * ratio;
      } else {
      width = window.innerWidth;
          height = width / ratio;
      }
    bigImage.style.backgroundImage = `url('${target.currentSrc}')`;
    bigImage.insertAdjacentHTML('afterbegin', '<div class="close">×</div>');
    bigImage.addEventListener('transitionend', () => bigImage.querySelector('.close').style.opacity = 1);
    bigImage.addEventListener('click', ev => {
      ev.stopPropagation();
      bigImage.addEventListener('transitionend', () => {
              bigImage.remove();
              document.body.classList.remove('show');
          });
      bigImage.style.transition = `width .5s ease-in, height .5s ease-in`;
      bigImage.style.height = bigImage.style.width = 0;
    });
      bigImage.classList.add('active');
      setTimeout(() => {
          bigImage.style.transition = `box-shadow 0.5s linear 0.5s,
              top 1s ease-out,
              left 1s ease-out,
          transform 1s ease-out,
              width 1s ease-in,
              height 1s ease-in`;
          bigImage.style.width = `${width / 1.3}px`;
          bigImage.style.height = `${height / 1.3}px`;
          bigImage.style.top = `${(-imagesRect.y) + height / 2}px`;
          bigImage.style.left = `50%`;
          bigImage.style.transform = `translate(-50%, -50%) rotate(0turn)`;
      }, 100);
  });