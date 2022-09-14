const characterGallery = document.querySelector('main')
const descriptionContainer = document.querySelector('.description__container')

const filterAlive = (array) => {
  return array.filter(item => item.dead !== true)
}

const sortAlphabetically = (array) => {
  array.sort((a, b) => a.name.localeCompare(b.name))
  array.sort((a, b) => a.name.split(' ').pop().localeCompare(b.name.split(' ').pop()))
}

/* Korábbi verzió, képre és névre kattintás külön

const characterPicker = () => {
  const portraitContainer = document.querySelectorAll('.portrait__container img')
  portraitContainer.forEach(item => item.addEventListener('click', buttonClick))
  const nameContainer = document.querySelectorAll('.name')
  nameContainer.forEach(item => item.addEventListener('click', buttonClick))
}

const whoIsThis = (clickedElement) => {
  if (clickedElement.classList.contains('name')) {
    return clickedElement.innerHTML
  } else if (clickedElement.nodeName === 'IMG') {
    return clickedElement.parentElement.nextElementSibling.innerHTML;
  }
}
*/

// Karakter kiválasztása - eseményfigyelő és jelölő
let previouslySelected = '';

const characterPicker = () => {
  const characterContainer = document.querySelectorAll('.character__container')
  characterContainer.forEach(item => item.addEventListener('click', buttonClick))
}

const whoIsThis = (clickedElement) => {
  return clickedElement.querySelector('.name').innerHTML
}

const displaySelection = (clickedElement) => {
  previouslySelected === '' ? undefined : previouslySelected.removeAttribute('class');
  const clickedPersonPhoto = clickedElement.querySelector('img')
  clickedPersonPhoto.classList.add('selected')
  previouslySelected = clickedPersonPhoto;
}

async function buttonClick() {
  displaySelection(this)
  const pickedCharacter = whoIsThis(this)
  try {
    const response = await fetch('./json/got.json');
    const data = await response.json();

    const pickedObject = data.find(obj => {
      return obj.name === pickedCharacter
    })
    createDescription(pickedObject)
  }
  catch (error) {
    console.error(error)
  }
}

// Karakterválasztó - egy karakter mezője
const createCharacters = (array) => {
  array.forEach(characterData => {
    const element = `<div class="character__container">
    <div class="portrait__container">
    <img src="./${characterData.portrait}" alt="character portrait">
    </div>
    <div class="name">${characterData.name}</div>
    </div>`
    characterGallery.insertAdjacentHTML("beforeend", element)
  }
  )
}

// Karakterválasztó - adatok meghívása és felépítés
const createGallery = async () => {
  try {
    const response = await fetch('./json/got.json');
    const data = await response.json();
    const dataAlive = filterAlive(data)
    sortAlphabetically(dataAlive)
    createCharacters(dataAlive)
    characterPicker()
  }
  catch (error) {
    console.error(error)
  }
};

createGallery()


// Részletes leírás felépítése
const createDescription = (object) => {
  const element = `<div class="picture__container">
  <img src="./${'picture' in object ? object.picture : 'assets/pictures/placeholder.jpg'}" alt="character picture">
  </div>
  <div class="id__container">
  <div class="name__detailed">${object.name}</div>
  <div class="crest__container">
  <img src="./assets/houses/${'house' in object ? object.house : 'placeholder'}.png" alt="crest">
  </div>
  </div>
  <div class="description">${object.bio == '' || object.bio === undefined ? 'No bio for this character.' : object.bio}</div>`
  descriptionContainer.innerHTML = ''
  descriptionContainer.insertAdjacentHTML("beforeend", element)
}

const createNotFound = () => {
  const element = `<div class="picture__container">
  <img src="./assets/pictures/placeholder.jpg" alt="character not found">
  </div>
  <div class="id__container">
  <div class="name__detailed">Character not found.</div>
  <div class="crest__container">
  <img src="./assets/houses/placeholder.png" alt="not found"> 
  </div>
  </div>
  <div class="description"></div>`
  descriptionContainer.innerHTML = ''
  descriptionContainer.insertAdjacentHTML("beforeend", element)
  searchInput.value = '';
}


// Részletes leírás - keresés, adatok meghívása, megjelenítés
const searchInput = document.querySelector('input')
const buttonInput = document.querySelector('button')

const searchEvent = () => {
  searchForCharacter();
  displaySearchedSelection(searchInput.value)
  searchInput.value = '';
}

buttonInput.addEventListener('click', searchEvent)

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchEvent()
  }
});

const searchForCharacter = async () => {
  const searchedCharacter = searchInput.value
  try {
    const response = await fetch('./json/got.json');
    const data = await response.json();

    const pickedObject = data.find(object => {
      return object.name.toLocaleLowerCase() === searchedCharacter.toLocaleLowerCase()
    })
    pickedObject === undefined ? createNotFound() : createDescription(pickedObject)
  }
  catch (error) {
    console.error(error)
  }
}

// Karakter kijelölése karakterválasztóban, szöveges bevitel esetén is
const displaySearchedSelection = (string) => {
  const searchedName = Array.from(document.querySelectorAll('.name'))
    .find(el => el.innerHTML.toLocaleLowerCase() === string.toLocaleLowerCase())
  searchedName === undefined ? undefined : displaySelection(searchedName.parentElement)
}
