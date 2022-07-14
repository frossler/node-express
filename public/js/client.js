
const socket = io();



const chat = document.querySelector('#chat');
const compressionDiv = document.querySelector('#compression');


async function fetchMessagesAndUpdateUI() {
   const messages = await (await fetch('/api/messages')).json();


   const template = Handlebars.compile(
      '<span style="color: blue; font-weight: 600;">{{this.author.id}}: </span><span style="color: brown;">[{{this.date}}] </span><span style="color: green; font-style: italic;">{{this.text}}</span>'
   );



   const elements = messages.map((message) => {
      const li = document.createElement('li');
      li.innerHTML = template(message);

      return li;
   });

   chat.innerHTML = '';

   elements.forEach((element) => {
      chat.appendChild(element);
   });
}

window.addEventListener('DOMContentLoaded', () => {
   fetchMessagesAndUpdateUI();
});

const form = document.querySelector('#form');
const titleInput = document.querySelector('#title');
const priceInput = document.querySelector('#price');
const thumbnailInput = document.querySelector('#thumbnail');

const table = document.querySelector('#table');

form.addEventListener('submit', (e) => {
   e.preventDefault();

   if (titleInput.value && priceInput.value && thumbnailInput.value) {
      const product = {
         title: titleInput.value,
         price: priceInput.value,
         thumbnail: thumbnailInput.value,
      };

      socket.emit('add-product', product);
      titleInput.value = '';
      priceInput.value = '';
      thumbnailInput.value = '';
   }
});

socket.on('update-products', (product) => {
   const template = Handlebars.compile(
      "<td>{{title}}</td><td>{{price}}</td><td><img src={{thumbnail}} style='width:50px;'></img></td>"
   );

   const tr = document.createElement('tr');

   tr.innerHTML = template(product);

   table.appendChild(tr);
});

const messageForm = document.querySelector('#messages');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const nameInput = document.querySelector('#name');
const lastNameInput = document.querySelector('#lastname');
const aliasInput = document.querySelector('#alias');
const ageInput = document.querySelector('#age');
const avatarInput = document.querySelector('#avatar');

const errors = document.querySelector('#errors');

const inputs = [
   emailInput,
   messageInput,
   nameInput,
   lastNameInput,
   aliasInput,
   ageInput,
   avatarInput,
];

messageForm.addEventListener('submit', (e) => {
   e.preventDefault();
   errors.innerHTML = '';

   inputs.forEach((input) => {
      if (!input.value) {
         const error = document.createElement('p');
         error.innerHTML = `${input.name} es requerido`;

         errors.append(error);
      }
   });

   if (messageInput.value && emailInput.value) {
      const message = {
         author: {
            id: emailInput.value,
            nombre: nameInput.value,
            apellido: lastNameInput.value,
            alias: aliasInput.value,
            edad: ageInput.value,
            avatar: avatarInput.value,
         },
         text: messageInput.value,
      };
      socket.emit('message', message);

      inputs.forEach((input) => (input.value = ''));
   }
});

socket.on('message', (message) => {
   fetchMessagesAndUpdateUI();
});
