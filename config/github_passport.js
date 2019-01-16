import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import rp from 'request-promise';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from './keys';
import { githubApiRequest } from '../server/src/utils/uri_utils';
import User from '../server/src/models';

passport.serializeUser((user, done) => {
  console.log('Serialize: ', user);
  done(null, user.username);
});

passport.deserializeUser((user, done) => {
  console.log('Deserialize: ', user);
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('passport authenticated: ', profile);
      const userInfo = {
        githubId: profile.id,
        username: profile.username,
        githubApiUrl: profile._json.url,
        githubUrl: profile._json.html_url,
        numRepos: profile._json.public_repos,
        numFollowers: profile._json.followers,
        avatarUrl: profile._json.avatar_url
      };
      let numFollowing = profile._json.following;
      let allFollowingUsersUsernames, currentUser;
      let options = { upsert: true, new: true, setDefaultsOnInsert: true };
      User.findOneAndUpdate({ id }, userInfo, options)
        .then((user) => {
          currentUser = user;
          const { username } = currentUser;
          const numPages = Math.ceil(numFollowing / 30);
          const userFollowingPromises = [];
          for (i = 1; i <= numPages; i++) {
            const userFollowingUri = githubApiRequest(
              `https://api.github.com/users/${username}/following`
            );
            userFollowingUri.qs.page = i;
            userFollowingPromises.push(rp(userFollowingUri));
          }
          done(null, user);
          return Promise.all(
            userFollowingPromises.map((promise) => promise.catch((err) => err))
          );
        })
        .then((allUsersFollowing) => {
          allFollowingUsersUsernames = allUsersFollowing.reduce(
            (a, c) => a.concat(c.map((user) => user.login)),
            []
          );
          return User.find({ useranme: { $in: allFollowingUsersUsernames } });
        })
        .then((usersInDb) => {
          const dbUserUsernames = usersInDb.map((user) => user.username);
          const newUserPromises = [];
          allFollowingUsersUsernames.forEach((username) => {
            if (dbUserUsernames.includes(username)) {
              // add user to logged in user's users that he/she is following
            } else {
              // add user to DB and add user to logg
              newUserPromises.push(
                rp(githubApiRequest(`https://api.github.com/users/${username}`))
              );
            }
          });
          Promise.all(
            newUserPromises.map((promise) => promise.catch((err) => err))
          )
            .then((users) => {
              users = users.map((user) => ({
                githubId: user.id,
                username: user.login,
                githubApiUrl: user.url,
                githubUrl: user.html_url,
                numRepos: user.public_repos,
                numFollowers: user.followers,
                avatarUrl: user.avatar_url
              }));
              return User.create(users);
            })
            .then((users) => {
              User.update(
                { username: currentUser.username },
                {
                  usersFollowing: { $each: users.map((user) => user._id) }
                },
                { upsert: true }
              );
            });
        });
    }
  )
);
