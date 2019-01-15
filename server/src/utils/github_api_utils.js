import { githubApiRequest } from './uri_utils';
import rp from 'request-promise';

export const getCodeResultsOfUsers = (
  usersArr,
  searchInputArr,
  language,
  responseArr
) => {
  const promises = [];
  const query = searchQueryString(searchInputArr, usersArr, language);
  const request = githubApiRequest(
    `https://api.github.com/search/code?${query}`
  );
  return rp(request).then((codeSearchResponse) => {
    const searchResults = codeSearchResponse.items;
    searchResults.forEach((file) => {
      const { url } = file;
      const resultObj = {
        url,
        file_name: file.name,
        avatar: file.repository.owner.avatar_url,
        username: file.repository.owner.login,
        repository: file.repository.name,
        user_github_url: file.repository.owner.html_url,
        file_html_url: file.html_url
      };
      responseArr.push(resultObj);
      promises.push(rp(githubApiRequest(url)));
    });
    return Promise.all(promises.map((promise) => promise.catch((err) => err)));
  });
};

const searchQueryString = (searchInputArr, usersArr, language) => {
  let queryString = 'q=';
  searchInputArr.forEach((input) => (queryString += `${input}+`));
  usersArr.forEach((username) => (queryString += `user:${username}+`));
  queryString += `language:${language}`;
  return searchQueryString;
};
