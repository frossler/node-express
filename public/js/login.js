const form = document.querySelector('#form');
const nameInput = document.querySelector('#name');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (nameInput.value) {
    console.log(nameInput.value);

    await fetch('login', {
      method: 'POST',
      body: JSON.stringify({
        name: nameInput.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return;

        if (data.redirect) window.location.href = data.redirect;
        console.log(data);
      })
      .catch((err) => console.log(err));
  }
});
