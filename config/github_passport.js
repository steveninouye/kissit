const passport = require('passport');
const knex = require('./knex/knex');
const GitHubStrategy = require('passport-github').Strategy;
const request = require('request');
const rp = require('request-promise');
const keys = require('./config/keys');

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

passport.serializeUser((user, done) => {
  console.log('Serialize: ', user);
  done(null, user.username);
});

passport.deserializeUser((user, done) => {
  console.log('Deserialize: ', user);
  // done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      // options for google strategy
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: '/auth/github/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('passport authenticated: ', profile);
      const { username } = profile;
      const {
        url,
        html_url,
        public_repos,
        followers,
        following,
        avatar_url
      } = profile._json;
      // check if user already exists in our own db
      // already have this user
      // console.log('user is: ', profile);

      knex('users')
        .select()
        .where('username', username)
        .then((data) => {
          const userApiUrl = {
            url: `https://api.github.com/users/${username}`,
            qs: {
              client_id: clientId,
              client_secret: clientSecret
            },
            headers: {
              'User-Agent': 'steveninouye'
            },
            json: true
          };
          if (data.length === 0) {
            knex('users')
              .returning('user_id')
              .insert({
                username: username,
                github_api_url: url,
                github_url: html_url,
                num_of_repo: public_repos,
                num_of_fav: following,
                num_of_followers: followers,
                avatar: avatar_url
              })
              .then((user_id) => {
                user_id = parseInt(user_id[0], 10);
                getUserFavorites(user_id, username, following);
                done(null, profile);
              });
          } else {
            console.log(`Updating "${profile.username}" information`);
            knex('users')
              .where('username', username)
              .returning('user_id')
              .update({
                github_api_url: url,
                github_url: html_url,
                num_of_repo: public_repos,
                num_of_fav: following,
                num_of_followers: followers,
                avatar: avatar_url
              })
              .then((user_id) => {
                console.log(`${username} updated`);
                user_id = parseInt(user_id[0], 10);
                getUserFavorites(user_id, username, following);
                done(null, profile);
              });
          }
        });
    }
  )
);

function getUserFavorites(githubId, username, numFavorites) {
  console.log('getuserfavorites');
  const userFollowingApiUrl = {
    url: `https://api.github.com/users/${username}/following`,
    qs: {
      page: 1,
      client_id: clientId,
      client_secret: clientSecret
    },
    headers: {
      'User-Agent': 'steveninouye'
    },
    json: true
  };
  const pages = Math.ceil(numFavorites / 30);
  const favRequestPromises = [];
  for (i = 1; i <= pages; i++) {
    userFollowingApiUrl.qs.page = i;
    favRequestPromises.push(rp(userFollowingApiUrl));
  }
  Promise.all(favRequestPromises).then((allFavoritesArray) => {
    const allFavorites = allFavoritesArray.reduce((a, c) => {
      let combinedArray = a.concat(c);
      return combinedArray;
    }, []);
    allFavorites.forEach((e) => {
      knex('users')
        .select()
        .where('github_url', e.html_url)
        .then((result) => {
          if (!result[0]) {
            /////////////////////// request favorite user API
            const githubUserApiUrl = {
              url: e.url,
              qs: {
                client_id: clientId,
                client_secret: clientSecret
              },
              headers: {
                'User-Agent': 'steveninouye'
              },
              json: true
            };
            request(githubUserApiUrl, (err, res, body) => {
              // add user to user_github table
              knex('users')
                .returning('user_id')
                .insert({
                  username: body.login,
                  github_api_url: body.url,
                  github_url: body.html_url,
                  num_of_repo: body.public_repos,
                  num_of_fav: body.following,
                  num_of_followers: body.followers,
                  avatar: body.avatar_url
                })
                // attach user to user's favorites
                .then((id) => {
                  knex('user_fav_user')
                    .insert({
                      user_id: parseInt(githubId, 10),
                      fav_user_id: parseInt(id, 10)
                    })
                    .then(() => console.log('Favorite Added'));
                  console.log('New user Added');
                });
            });
          } else {
            knex('user_fav_user')
              .select()
              .where({
                user_id: parseInt(githubId, 10),
                fav_user_id: parseInt(result[0].user_id, 10)
              })
              .then((matchedFavUser) => {
                if (!matchedFavUser[0]) {
                  knex('user_fav_user')
                    .insert({
                      user_id: parseInt(githubId, 10),
                      fav_user_id: parseInt(result[0].user_id, 10)
                    })
                    .then(() => {
                      console.log('Favorite added');
                    });
                } else {
                  console.log('user is already matched');
                }
              });
          }
        });
    });
  });
}
