const input = document.querySelector('#user');
const githubSearch = document.querySelector('.github-search');

class AppRequestInit {
  constructor() {
    this.method = 'GET';
    this.headers = new Headers();
    this.headers.mode = 'cors';
    this.headers.set('Content-Type', 'application/json');
    this.headers.append(
      'Authorization',
      'token xxxxxxxxxxxxxxxxxxxxxxxxxxxxx' //token 
    );
  }
}

class Github {

  constructor() {
    this.clientId = 'your client id';
    this.clientSecret = 'your client secret';
    this.reposCount = this.reposSort = 'created: asc';
  }

  async getUsers(user) {
    const userProfile = await fetch(
      `https://api.github.com/users/${user}?client_id=${this.clientId}&client_secret=${this.clientSecret}`,
      new AppRequestInit()
    );
    const userRepo = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=${this.reposCount}&sort=${this.reposSort}&client_id=${this.clientId}&client_secret=${this.clientSecret}`,
      new AppRequestInit()
    );
    if (userProfile.status && userRepo.status !== 200) {
      throw new Error('Error thrown');
    }

    const profile = await userProfile.json();
    const repos = await userRepo.json();
    return {
      profile,
      repos,
    };
  }
}

class UI {

  constructor() {
    this.profile = document.getElementById('profile');
    this.repositories = document.getElementById('repositories');
  }

  profileUI(data) {
    this.profile.innerHTML = `
      <img src='${data.avatar_url}' alt='profile/img'>
      <h1>${data.name}</h1>
      <h3>${data.login}</h3>
      <p>${data.bio}</p>
      <a href="${data.html_url}">
        <button>View on github</button>
      </a>
      <div class='following-wrapper'>
      <div class='follower'>
       <i class='fa fa-users'></i>
        <strong>${data.followers}</strong>
        followers
      </div>
      <div class='following'>
        <strong>${data.following}</strong>
        following
      </div>
    </div>
    <div class='location'>
     <i class='fa fa-map'></i>
      ${data.location}
    </div>
    <div class='twitter'>
      ${data.twitter_username !== null
        ? `<a href='https://www.twitter.com/${data.twitter_username}'><i class='fa fa-twitter'></i> @${data.twitter_username}</a>`
        : ''
      } 
    </div>
    `;
  }

  reposUI(data) {
    var count = 0;
    data.forEach((data) => {
      count++;
    });
    this.repositories.innerHTML = `
    <div class="repo-head">
      <i class="fa fa-book"></i>
      <p>Repositories</p>
      <p id="count">${count}</p>
    </div>
    `;

    const uniRepo_wrapper = document.createElement('div');
    uniRepo_wrapper.classList.add('uniRepo-wrapper');

    data.forEach((data) => {
      const uniRepo = document.createElement('div');
      uniRepo.classList.add('uniRepo');

      const uniRepo_left = document.createElement('div');
      uniRepo_left.classList.add('uniRepo-left');

      uniRepo_left.innerHTML = `
      <a href="${data.html_url}">
      <h1>${data.name}</h1>
      </a>
      ${data.description !== null ? `<p>${data.description}</p>` : ``}
      
      `;

      const uniRepo_right = document.createElement('div');
      uniRepo_right.classList.add('uniRepo-right');

      uniRepo_right.innerHTML = `
      <div class='fork'>
          <p>${data.forks_count}</p>
          <p>Fork</p>
        </div>
        <div class='star'>
          <p>${data.stargazers_count}</p>
          <p>Star</p>
        </div>
      `;

      uniRepo.appendChild(uniRepo_left);
      uniRepo.appendChild(uniRepo_right);

      uniRepo_wrapper.appendChild(uniRepo);
      this.repositories.appendChild(uniRepo_wrapper);
    });
  }
}


const github = new Github();
const ui = new UI();

//Event
input.addEventListener('keyup', (e) => {
  if (input.value.trim() !== '') {

    githubSearch.style.display = 'none';

    github
      .getUsers(input.value.trim())
      .then((data) => {

        //console.log(data.profile, data.repos);
        ui.profileUI(data.profile);
        ui.reposUI(data.repos);
        console.log('User found');
      })
      .catch((err) => console.log(err.message));
  } else {

    this.profile.innerHTML = '';
    this.repositories.innerHTML = ``;
    githubSearch.style.display = 'block';

  }
});
