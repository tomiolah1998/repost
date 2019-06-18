/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// There are no unused vars - they are just in another JS file - these files are linked in HTML
// These functions are invoked from HTML, so they are not unused

async function pageLoaded() {
  // Get Subrepost By Name
  const subrepost = document.getElementById('sr-name').innerText;
  const sr = await (await fetch(`/api/subreposts/${subrepost}`)).json();

  const userListHTML = [];
  const modListHTML = [];

  // Create HTML elements
  sr.users.forEach((value) => {
    if (value.moderator) {
      modListHTML.push(`
        <li>
          <h3>${value.username}&nbsp;
            <a onclick="ban('${value.username}')" class="remove">
              <span uk-icon="icon: ban"></span>
            </a>&nbsp;
            <a onclick="downgrade('${value.username}')" class="remove">
              <span uk-icon="icon: pull"></span>
            </a>
          </h3>
        </li>
      `);
    } else {
      userListHTML.push(`
        <li>
          <h3>${value.username}&nbsp;
            <a onclick="ban('${value.username}')" class="remove">
              <span uk-icon="icon: ban"></span>
            </a>&nbsp;
            <a onclick="upgrade('${value.username}')" class="add">
              <span uk-icon="icon: plus-circle"></span>
            </a>
          </h3>
        </li>
      `);
    }
  });

  modListHTML.push('<li><a class="add" onclick="addMod()"><span uk-icon="icon: plus-circle; ratio: 1.5"></span></a></li>');
  userListHTML.push('<li><a class="add" onclick="addUser()"><span uk-icon="icon: plus-circle; ratio: 1.5"></span></a></li>');

  // Clear lists
  document.getElementById('mod-list').innerText = '';
  document.getElementById('user-list').innerText = '';
  // Inject into HTML
  modListHTML.forEach(elem => document.getElementById('mod-list').insertAdjacentHTML('beforeend', elem));
  userListHTML.forEach(elem => document.getElementById('user-list').insertAdjacentHTML('beforeend', elem));
}

pageLoaded();

function addUser() {
  const subrepost = document.getElementById('sr-name').innerText;
  UIkit.modal.prompt('User to add:', '')
    .then(async (username) => {
      if (username) {
        await fetch(`/api/subreposts/${subrepost}`, {
          method: 'PATCH',
          json: true,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, moderator: false }),
        });
        pageLoaded();
      }
    });
}

function addMod() {
  const subrepost = document.getElementById('sr-name').innerText;
  UIkit.modal.prompt('User to add as Moderator:', '')
    .then(async (username) => {
      if (username) {
        await fetch(`/api/subreposts/${subrepost}`, {
          method: 'PATCH',
          json: true,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, moderator: true }),
        });
        pageLoaded();
      }
    });
}

function deleteSub(subrepost) {
  UIkit.modal.prompt(`<h1 class="uk-text-danger">WARNING!</h1> This operation cannot be undone! <div class="uk-alert-danger" uk-alert><p>To confirm your request please type in the name of this subrepost (<b>${subrepost}</b>):</p></div>`, '')
    .then(async (input) => {
      if (input === subrepost) {
        await fetch(`/api/subreposts/${subrepost}`, {
          method: 'DELETE',
        });
        window.location = '/home';
      }
    });
}

async function ban(username) {
  const subrepost = document.getElementById('sr-name').innerText;
  await fetch(`/api/subreposts/${subrepost}`, {
    method: 'PATCH',
    json: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, remove: true }),
  });
  pageLoaded();
}

async function downgrade(username) {
  const subrepost = document.getElementById('sr-name').innerText;
  await fetch(`/api/subreposts/${subrepost}`, {
    method: 'PATCH',
    json: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, moderator: false }),
  });
  pageLoaded();
}

async function upgrade(username) {
  const subrepost = document.getElementById('sr-name').innerText;
  await fetch(`/api/subreposts/${subrepost}`, {
    method: 'PATCH',
    json: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, moderator: true }),
  });
  pageLoaded();
}
