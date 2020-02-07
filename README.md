# normalize-id

[![Travis build status](http://img.shields.io/travis/gajus/normalize-id/master.svg?style=flat-square)](https://travis-ci.org/gajus/normalize-id)
[![Coveralls](https://img.shields.io/coveralls/gajus/normalize-id.svg?style=flat-square)](https://coveralls.io/github/gajus/normalize-id)
[![NPM version](http://img.shields.io/npm/v/normalize-id.svg?style=flat-square)](https://www.npmjs.org/package/normalize-id)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Destructive foreign ID normalization.

## Use case

To normalize unstable inputs that are treated like IDs into a stable ID form.

This is useful when you do not trust the foreign ID representation to be stable, e.g. when you are treating URLs as IDs of a foreign resource and those URLs can have varying representation. However, it also means that two foreign IDs that vary in their semantic meaning only in characters that are removed or transliterated during normalization will produce the same ID, e.g. `deja` and `déjà` are both normalized to `DEJA`.

Although arbitrary, the applied normalization rules are derived through trial-and-error by aggregating data from thousands of different websites and optimizing for the most stable outputs with the least collisions.

The normalized IDs conform to `^(?!_)[A-Z0-9_]+(?<!_)$`.

A non-exhaustive example of inputs and outputs (in each paragraph: first line is input, second – output):

```
fooBarBaz
FOO_BAR_BAZ

FooBarBaz
FOO_BAR_BAZ

foo-bar-baz
FOO_BAR_BAZ

foo---bar---baz
FOO_BAR_BAZ

foo___bar___baz
FOO_BAR_BAZ

foo:::bar:::baz
FOO_BAR_BAZ

foo   bar   baz
FOO_BAR_BAZ

```

Inputs can also be URLs, e.g.

```
# Protocol is excluded. URL query parameter semantics is recognized.
http://foo.com/bar/baz-baz.baz?qux=quux#corge
FOO_COM_BAR_BAZ_BAZ_BAZ_QUX_QUUX_CORGE

# URL query parameters are sorted.
http://foo.tld/?bar=baz&qux=quux
FOO_TLD_BAR_BAZ_QUX_QUUX

```

Refer to the [test cases](./src/test/utilities/normalizeId.js) to view the normalization rules.

## API

```js
import {
  normalizeId,
} from 'normalize-id';

normalizeId(foreignId: string): string;

```
