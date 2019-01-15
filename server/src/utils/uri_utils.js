import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../../../config/keys';

export const githubApiRequest = (uri) => {
  const request = {
    uri,
    qs: {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET
    },
    headers: {
      'User-Agent': 'steveninouye'
    },
    json: true
  };
  return Object.assign({}, request);
};
