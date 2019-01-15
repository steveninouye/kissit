import express from 'express';

import { getCodeResultsOfUsers } from '../utils/github_api_utils';

const code = express.Router();

code.post('/search', (req, res) => {
  const { searchInput, language } = JSON.parse(req.body);
  const user = req.user ? req.user.username : 'steveninouye';

  getCodeResultsOfUsers([user], searchInput, language, res).then((fileJson) => {
    res.send(fileJson);
  });
});

// router.post('/db/search', (req, res) => {
//   const searchInput = JSON.parse(req.body.searchInput);
//   const user = req.user ? req.user.username : undefined;
//   console.log('searchInput: ', searchInput);
//   console.log('this is the user: ', user);
//   let clientResponse = [];
//   let prevClientResponseLength = 0;
//   /////////////   FUNCTION     /////////////////////
//   const getResultsOfUsers = (userArr, searchArr, resArr) => {
//     const promiseArr = [];
//     const userQueryString = userArr.reduce(
//       (acc, user) => `${acc}+user:${user.username}`,
//       ''
//     );
//     const searchStringQuery = searchArr.reduce(
//       (acc, termStr) => `${acc}${termStr}+`,
//       ''
//     );
//     const gitHubApiReqObj = Object.assign({}, gitHubReqObj);
//     gitHubApiReqObj.uri += `q=${searchStringQuery}language:JavaScript${userQueryString}`;
//     return reqProm(gitHubApiReqObj).then((codeApiResponse) => {
//       const searchResults = codeApiResponse.items;
//       searchResults.forEach((file) => {
//         const repository = file.repository.name;
//         const username = file.repository.owner.login;
//         const avatar = file.repository.owner.avatar_url;
//         const user_github_url = file.repository.owner.html_url;
//         const file_html_url = file.html_url;
//         // end of the url
//         const blobIndex = file_html_url.indexOf('/blob/');
//         const endUrl = file_html_url.slice(blobIndex + 6);
//         const firstSlashIndex = endUrl.indexOf('/');
//         const file_path = endUrl.slice(firstSlashIndex + 1);
//         const lastSlashIndex = endUrl.lastIndexOf('/');
//         const file_name = endUrl.slice(lastSlashIndex + 1);
//         const resultObj = {
//           avatar,
//           username,
//           repository,
//           user_github_url,
//           file_html_url,
//           file_path,
//           file_name
//         };
//         // push result into response array
//         resArr.push(resultObj);
//         // create object to request code
//         const rawReqObj = Object.assign({}, gitHubReqObj);
//         rawReqObj.uri = `https://raw.githubusercontent.com/${username}/${repository}/${endUrl}`;
//         delete rawReqObj.json;
//         promiseArr.push(reqProm(rawReqObj));
//       });
//       return Promise.all(promiseArr.map((prom) => prom.catch((err) => err)));
//     });
//   };
//   ///////////////////////////////////////////////////////////
//   if (user) {
//     knex('users')
//       .select('username')
//       .where('username', user)
//       .then((users) => {
//         return getResultsOfUsers(users, searchInput, clientResponse);
//       })
//       .then((codeArray) => {
//         codeArray.forEach((code, index) => {
//           if (!code.error) {
//             clientResponse[index].file_code = code;
//           }
//         });
//         clientResponse = clientResponse.filter((e) => e.file_code);
//         prevClientResponseLength = clientResponse.length;
//         return knex('users')
//           .select('fu.username')
//           .join({ f: 'user_fav_user' }, 'f.user_id', '=', 'users.user_id')
//           .join({ fu: 'users' }, 'fu.user_id', '=', 'f.fav_user_id')
//           .where('users.username', user);
//       })
//       .then((favUsers) => {
//         return getResultsOfUsers(favUsers, searchInput, clientResponse);
//       })
//       .then((favUserCodeArr) => {
//         favUserCodeArr.forEach((code, index) => {
//           if (!code.error) {
//             clientResponse[index].file_code = code;
//           }
//         });
//         clientResponse = clientResponse.filter((e) => e.file_code);
//         prevClientResponseLength = clientResponse.length;
//         const currentUsernames = clientResponse.reduce((acc, user) => {
//           if (acc.indexOf(user.username) === -1) {
//             acc.push(user.username);
//           }
//           return acc;
//         }, []);
//         return knex('users')
//           .select('username')
//           .whereNotIn('users.username', currentUsernames)
//           .orderBy('users.num_of_followers', 'desc')
//           .limit(50);
//       })
//       .then((miscUsernames) => {
//         return getResultsOfUsers(miscUsernames, searchInput, clientResponse);
//       })
//       .then((miscUserCodeArr) => {
//         miscUserCodeArr.forEach((code, index) => {
//           if (!code.error) {
//             clientResponse[index].file_code = code;
//           }
//         });
//         clientResponse = clientResponse.filter((e) => e.file_code);
//         res.json(clientResponse);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send('could not get search data');
//       });
//   } else {
//     knex('users')
//       .select('username')
//       .orderBy('num_of_followers', 'desc')
//       .limit(50)
//       .then((users) => {
//         return getResultsOfUsers(users, searchInput, clientResponse);
//       })
//       .then((codeArray) => {
//         codeArray.forEach((code, index) => {
//           if (!code.error) {
//             clientResponse[index].file_code = code;
//           }
//         });
//         clientResponse = clientResponse.filter((e) => e.file_code);
//         res.json(clientResponse);
//       })
//       .catch((err) => {
//         // console.log(err);
//         res.send('could not get search data');
//       });
//   }
// });

export default code;
