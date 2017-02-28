import test from 'tape';
import proxyquire from 'proxyquire';
import { spy } from 'sinon';
import Start from 'start';

const noopReporter = () => {};
const start = Start(noopReporter);

test('parallel tasks + resolve', (t) => {
  const testSpy = spy();
  const parallel = proxyquire('../../lib/', {
    execa(command, args) {
      testSpy(args.slice(1));

      return Promise.resolve({
        stdout: args[args.length - 1]
      });
    }
  }).default;
  const testTask1 = () => {};
  const testTask2 = () => {};

  start(
    parallel(
      testTask1,
      testTask2
    )
  ).then(() => {
    t.true(
      testSpy.calledTwice,
      'spy must been called twice'
    );

    t.true(
      testSpy.firstCall.calledWithMatch([
        '--preset',
        'start-start-preset',
        'testTask1'
      ]),
      'first call must happen with testTask1 arguments'
    );

    t.true(
      testSpy.secondCall.calledWithMatch([
        '--preset',
        'start-start-preset',
        'testTask2'
      ]),
      'first call must happen with testTask2 arguments'
    );

    t.end();
  });
});

test('parallel tasks + first reject', (t) => {
  const testSpy = spy();
  const parallel = proxyquire('../../lib/', {
    execa(command, args) {
      const taskName = args[args.length - 1];

      testSpy(args.slice(1));

      if (taskName === 'testTask1') {
        return Promise.reject(taskName);
      }

      return Promise.resolve({
        stdout: taskName
      });
    }
  }).default;
  const testTask1 = () => {};
  const testTask2 = () => {};

  start(
    parallel(
      testTask1,
      testTask2
    )
  ).catch(() => {
    t.true(
      testSpy.calledTwice,
      'spy must been called twice'
    );

    t.true(
      testSpy.firstCall.calledWithMatch([
        '--preset',
        'start-start-preset',
        'testTask1'
      ]),
      'first call must happen with testTask1 arguments'
    );

    t.true(
      testSpy.secondCall.calledWithMatch([
        '--preset',
        'start-start-preset',
        'testTask2'
      ]),
      'first call must happen with testTask2 arguments'
    );

    t.end();
  });
});
