// @flow

import createUrlRegex from 'url-regex';
import normalizeUrl from 'normalize-url';
import parseUrl from 'parse-url';
import {
  transliterate,
} from 'transliteration';

const URL_REGEX = createUrlRegex({
  exact: true,
  strict: true,
});

const NORMALIZED_ID = /^(?!_)[A-Z0-9_]+(?<!_)$/;

// @see https://stackoverflow.com/a/14313213/368691
// eslint-disable-next-line no-control-regex
const PRINTABLE_ASCII_REGEX = /^[\u0020-\u007F]*$/;

const SPLIT_REGEX = /([a-z][A-Z])|\+|\*|\s+|_+|-+/g;
const REPEATING_CHARACTERS_REGEX = /_+/g;
const UNSAFE_CHARACTERS_REGEX = /[^A-Z0-9_]/g;
const TRIM_REGEX = /^_|_$/g;

export default (input: string): string => {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string.');
  }

  if (NORMALIZED_ID.test(input)) {
    return input;
  }

  let normalizedIdentifier = input.trim();

  if (URL_REGEX.test(normalizedIdentifier)) {
    const urlTokens = parseUrl(decodeURI(normalizeUrl(normalizedIdentifier, {
      removeDirectoryIndex: true,
      stripHash: false,
      stripWWW: true,
    })));

    // The reason for including `resource` token is because in case of generating FUIDs
    // for venues, the domain might be different for each venue.
    // eslint-disable-next-line no-useless-escape
    normalizedIdentifier = [
      urlTokens.resource.replace(/\./g, '_'),
      urlTokens.pathname.replace(/\//g, '_'),
      urlTokens.search.replace(/[=|&|+]/g, '_'),
      urlTokens.hash,
    ]
      .filter(Boolean)
      .join('_');
  }

  // Transliteration is expensive. Only do it if there are non-printable non-ASCII characters.
  if (!PRINTABLE_ASCII_REGEX.test(normalizedIdentifier)) {
    normalizedIdentifier = transliterate(normalizedIdentifier, {
      ignore: [
        '$',
        '£',
        '€',
      ],
      unknown: '',
    });
  }

  normalizedIdentifier = normalizedIdentifier
    .replace(/(?:[.|:]+)/g, '_')
    .replace(SPLIT_REGEX, (subject) => {
      if (subject === '+') {
        return '_PLUS_';
      }

      if (subject === '*') {
        return '_ASTERISK_';
      }

      if (subject.length === 2) {
        return subject.charAt(0) + '_' + subject.charAt(1);
      }

      return '_';
    })
    .toUpperCase()
    .replace(REPEATING_CHARACTERS_REGEX, '_')
    .replace(UNSAFE_CHARACTERS_REGEX, '')
    .replace(TRIM_REGEX, '');

  return normalizedIdentifier;
};
