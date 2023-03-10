const request = require('request');
/**
 * @param {Buffer|string} body - response body
 * @returns {string}
 */
const formatMessage = (body) => {
  return Buffer.isBuffer(body) ? body.toString('utf8') : body;
};
/**
 * @param {string} url - url
 * @param {object} qs - query string
 * @param {object|undefined} headers - headers
 * @param {any} encoding - encoding
 * @returns {Promise<string|Buffer|Error>}
 */
const get = (url, qs = {}, headers = {}, encoding = null) => {
  return new Promise((resolve, reject) => {
    request.get(
      { url: url + toQueryString(qs), headers, encoding },
      (error, response, body) => {
        if (error) {
          return reject(error);
        }
        if (response.statusCode >= 400) {
          return reject({
            message: formatMessage(body),
            statusCode: response.statusCode,
          });
        }
        if (response.headers['content-type'].includes('application/json')) {
          resolve(JSON.parse(body));
        }
        return resolve(body);
      },
    );
  });
};
/**
 * @param {string} url - url
 * @param {object} form - form
 * @param {object} [headers] - headers
 * @param {any} [encoding] - encoding
 * @param {object} [auth] - basic auth
 * @returns {Promise<string|Buffer|Error>}
 */
const post = (
  url,
  form,
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  headers = { 'content-type': 'application/json; charset=UTF-8' },
  encoding,
  auth,
) => {
  return new Promise((resolve, reject) => {
    const parameters = {
      method: 'POST',
      url,
      headers,
      form,
      json: true,
    };
    if (encoding !== undefined) {
      parameters.encoding = encoding;
    }
    if (auth !== undefined) {
      parameters.auth = auth;
    }
    request(parameters, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (response.statusCode >= 400) {
        return reject({
          message: formatMessage(body),
          statusCode: response.statusCode,
        });
      }
      return resolve(body);
    });
  });
};
/**
 * @description Serialization
 * @example { x: '', y: '', z: 'undefined' } => '?z=undefined'
 * @example { x: null, y: '2', z: undefined } => '?y=2'
 * @example { x: 1, y: '2', z: '3' } => '?x=1&y=2&z=3'
 * @param {object} data - data
 * @returns {string}
 */
const toQueryString = (data) => {
  const items = Object.entries(data)
    .filter(([_key, value]) => {
      switch (typeof value) {
        case 'object':
          return value !== null;
        case 'undefined':
          return value !== undefined;
        case 'string':
          return value.length > 0;
        default:
          return true;
      }
    })
    .map(([key, value]) => {
      return `${key}=${value}`;
    });
  return items.length > 0 ? `?${items.join('&')}` : '';
};

module.exports = {
  get,
  post,
};
