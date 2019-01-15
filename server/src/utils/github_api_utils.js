import { githubApiRequest } from './uri_utils';
import rp from 'request-promise';

export const getCodeResultsOfUsers = (
  usersArr,
  searchInputArr,
  language,
  response
) => {
  // stores all promises that will request code content
  const promises = [];
  const githubUri = githubCodeSearchUri(searchInputArr, usersArr, language);
  const request = githubApiRequest(githubUri);
  return new Promise((resolve, reject) => {
    // request JSON
    rp(request)
      .then((codeSearchResponse) => {
        // extrapolate search results
        const searchResults = codeSearchResponse.items;
        searchResults.forEach((file) => {
          // url to get actual code
          const { url } = file;
          // store values into the response object
          response[file.sha] = {
            url,
            github_id: file.sha,
            file_name: file.name,
            avatar: file.repository.owner.avatar_url,
            username: file.repository.owner.login,
            repository: file.repository.name,
            user_github_url: file.repository.owner.html_url,
            file_html_url: file.html_url,
            search: {
              [searchInputArr.join('+')]: file.score
            }
          };
          promises.push(rp(githubApiRequest(url)));
        });
        return Promise.all(
          promises.map((promise) => promise.catch((err) => err))
        );
      })
      .then((files) => {
        files.forEach(({ sha, content }) => (response[sha].content = content));
        resolve(response);
      })
      .catch((err) => reject(err));
  });
};

const githubCodeSearchUri = (searchInputArr, usersArr, language) => {
  let uri = 'https://api.github.com/search/code?q=';
  searchInputArr.forEach((input) => (uri += `${input}+`));
  usersArr.forEach((username) => (uri += `user:${username}+`));
  uri += `language:${language}`;
  return uri;
};
