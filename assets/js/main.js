// The Driver Academy — shared site behaviour

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });

    // close menu after clicking a link (mobile)
    nav.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  // Form submission: sends to Formspree via fetch (AJAX) so pupils/instructors
  // stay on the site and see our own "thanks" message, rather than being
  // redirected to Formspree's generic confirmation page.
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action');
      var hasRealEndpoint = action && action !== '#';
      var msg = form.querySelector('.form-success');
      var submitBtn = form.querySelector('button[type="submit"]');

      if (!hasRealEndpoint) {
        // No form service connected yet — placeholder behaviour.
        e.preventDefault();
        if (msg) {
          msg.style.display = 'block';
          form.reset();
          msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          alert('Thanks — this form is a placeholder. Connect it to a form service or your email to start receiving enquiries.');
        }
        return;
      }

      e.preventDefault();
      if (submitBtn) { submitBtn.disabled = true; }

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          if (msg) {
            msg.style.display = 'block';
            form.reset();
            msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            alert("Thanks — that's been sent. We'll be in touch soon.");
          }
        } else {
          response.json().then(function (data) {
            var text = (data && data.errors)
              ? data.errors.map(function (err) { return err.message; }).join(', ')
              : 'Something went wrong sending that — please try again, or contact us directly by phone or email.';
            alert(text);
          }).catch(function () {
            alert('Something went wrong sending that — please try again, or contact us directly by phone or email.');
          });
        }
      }).catch(function () {
        alert('Something went wrong sending that — please try again, or contact us directly by phone or email.');
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; }
      });
    });
  });

  // Highlight active nav link (ignore any #anchor on the link's href)
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('#')[0];
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
