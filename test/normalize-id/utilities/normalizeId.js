// @flow

import test from 'ava';
import normalizeId from '../../../src/utilities/normalizeId';

test('throws an error if input is not string', (t) => {
  const error = t.throws(() => {
    // $FlowFixMe
    normalizeId(null);
  });

  t.is(error.message, 'Input must be a string.');
});

test('makes the input uppercase', (t) => {
  t.is(normalizeId('foo'), 'FOO');
});

test('converts camelCase to underscore notation', (t) => {
  t.is(normalizeId('fooBarBaz'), 'FOO_BAR_BAZ');
});

test('converts PascalCase to underscore notation', (t) => {
  t.is(normalizeId('FooBarBaz'), 'FOO_BAR_BAZ');
});

test('converts kebab-case to underscore notation', (t) => {
  t.is(normalizeId('foo-bar-baz'), 'FOO_BAR_BAZ');
});

test('converts multiple dashes to a single underscore', (t) => {
  t.is(normalizeId('foo---bar---baz'), 'FOO_BAR_BAZ');
});

test('converts multiple underscores to a single underscore', (t) => {
  t.is(normalizeId('foo___bar___baz'), 'FOO_BAR_BAZ');
});

test('converts dots to underscores', (t) => {
  t.is(normalizeId('foo...bar...baz'), 'FOO_BAR_BAZ');
});

test('converts colons to underscores', (t) => {
  t.is(normalizeId('foo:::bar:::baz'), 'FOO_BAR_BAZ');
});

test('converts multiple adjacent pluses', (t) => {
  t.is(normalizeId('+++'), 'PLUS_PLUS_PLUS');
});

test('converts multiple white spaces to a single underscore', (t) => {
  t.is(normalizeId('foo  bar  baz'), 'FOO_BAR_BAZ');
  t.is(normalizeId('foo   bar   baz'), 'FOO_BAR_BAZ');
});

test('trims underscores, dots and colons', (t) => {
  t.is(normalizeId('---foo---'), 'FOO');
  t.is(normalizeId('___foo___'), 'FOO');
  t.is(normalizeId('...foo...'), 'FOO');
  t.is(normalizeId(':::foo:::'), 'FOO');
});

test('does not trim input', (t) => {
  let size = 100;

  let input = '';

  while (size--) {
    input += String(Math.random()).replace(/\./g, '');
  }

  t.is(normalizeId(input), input);
});

test('strips unicode symbols', (t) => {
  t.is(normalizeId('♥'), '');
  t.is(normalizeId('🦄'), '');
});

test('strips all non-characters', (t) => {
  t.is(normalizeId(';?:@&=/-_.!~\'"()'), '');
});

// @see https://github.com/pid/speakingurl/issues/3
// @see https://github.com/andyhu/transliteration/issues/83
test('strips currency characters', (t) => {
  t.is(normalizeId('$£€'), '');
});

test('transliterates input', (t) => {
  t.is(normalizeId('déjà vu'), 'DEJA_VU');
});

// Sometimes '+' caries importance, e.g.
// there is 'Premium Loge' and 'Premium Loge+' that we need to distinguish.
test('translates + to PLUS', (t) => {
  t.is(normalizeId('+'), 'PLUS');
  t.is(normalizeId('foo+'), 'FOO_PLUS');
});

// Sometimes '*' caries importance, e.g.
// there is 'Loge' and 'Loge*' that we need to distinguish.
test('translates * to ASTERISK', (t) => {
  t.is(normalizeId('*'), 'ASTERISK');
  t.is(normalizeId('foo*'), 'FOO_ASTERISK');
});

test('generates FUID using hostname, pathname, search query and hash', (t) => {
  t.is(normalizeId('http://foo.com/bar/baz-baz.baz?qux=quux#corge'), 'FOO_COM_BAR_BAZ_BAZ_BAZ_QUX_QUUX_CORGE');
});

test('normalizes URL prior to producing FUID (sorts query parameters)', (t) => {
  t.is(normalizeId('http://foo.tld/?bar=baz&qux=quux'), 'FOO_TLD_BAR_BAZ_QUX_QUUX');
});

test('normalizes URL prior to producing FUID (strips WWW)', (t) => {
  t.is(normalizeId('http://www.foo.tld/?bar=baz&qux=quux'), 'FOO_TLD_BAR_BAZ_QUX_QUUX');
});

test('normalizes URL prior to producing FUID (removes index)', (t) => {
  t.is(normalizeId('http://www.foo.tld/index.php?bar=baz&qux=quux'), 'FOO_TLD_BAR_BAZ_QUX_QUUX');
});

test('urldecodes URL prior to producing FUID', (t) => {
  t.is(normalizeId('http://foo.tld/foo%20bar/?bar=baz&qux=quux%20corge'), 'FOO_TLD_FOO_BAR_BAR_BAZ_QUX_QUUX_CORGE');
});

test('//, http:// and https:// URLs product the same FUID', (t) => {
  t.is(normalizeId('//foo.com/'), 'FOO_COM');
  t.is(normalizeId('http://foo.com/'), 'FOO_COM');
  t.is(normalizeId('https://foo.com/'), 'FOO_COM');
});
