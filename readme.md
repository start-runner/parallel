# start-parallel

[![npm](https://img.shields.io/npm/v/start-parallel.svg?style=flat-square)](https://www.npmjs.com/package/start-parallel)
[![linux build](https://img.shields.io/travis/start-runner/parallel/master.svg?label=linux&style=flat-square)](https://travis-ci.org/start-runner/parallel)
[![windows build](https://img.shields.io/appveyor/ci/start-runner/parallel/master.svg?label=windows&style=flat-square)](https://ci.appveyor.com/project/start-runner/parallel)
[![coverage](https://img.shields.io/codecov/c/github/start-runner/parallel/master.svg?style=flat-square)](https://codecov.io/github/start-runner/parallel)
[![deps](https://img.shields.io/gemnasium/start-runner/parallel.svg?style=flat-square)](https://gemnasium.com/start-runner/parallel)

[Parallel](https://bytearcher.com/articles/parallel-vs-concurrent/) tasks runner for [Start](https://github.com/start-runner/start).

:information_desk_person: See also [start-concurrent](https://github.com/start-runner/concurrent).

## Install

```sh
npm install --save-dev start-parallel
# or
yarn add --dev start-parallel
```

## Usage

```js
import Start from 'start';
import reporter from 'start-pretty-reporter';
import parallel from 'start-parallel';

const start = Start(reporter());

export const tasksRunner1 = (...params) => {
  return function task1() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  };
};

export const tasksRunner2 = (...params) => {
  return function task2() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  };
};

export const tasksRunner12 = (...params) => start(
  parallel(
    'taskRunner1',
    'taskRunner2'
  )(...params)
);
```

```
→ parallel: start

→ task2: start
→ task2: done

→ task1: start
→ task1: done

→ parallel: done
```

:heavy_exclamation_mark:

* works only with exported tasks runners
