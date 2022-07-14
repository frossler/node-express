const form = document.querySelector('#form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

form.addEventListener('submit', async (e) => {
   e.preventDefault();

   if (emailInput.value && passwordInput.value) {
      console.log({
         email: emailInput.value,
         password: passwordInput.value,
      });

      await fetch('login', {
         method: 'POST',
         body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
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
         .catch((err) => console.log({err}));
   }
});
