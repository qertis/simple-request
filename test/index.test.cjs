const test = require('node:test');
const assert = require('node:assert/strict');
const {get} = require('../index.cjs');

test('get', async (t) => {
    const siteBuffer = await get('https://prosto-diary.gotointeractive.com/');
    const html = siteBuffer.toString('utf8');
    assert.equal(html.slice(0, 15).toLowerCase(), '<!doctype html>');
});
