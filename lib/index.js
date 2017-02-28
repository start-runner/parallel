export default (...tasks) => () => {
  return function parallel() {
    const parseArgv = require('minimist');
    const buildArgv = require('dargs');
    const pSettle = require('p-settle');
    const execa = require('execa');

    const spawnCommand = process.argv[0];
    const startCommand = process.argv[1];
    const parsedArgv = parseArgv(process.argv.slice(2));
    const spawnOptions = {
      stripEof: false,
      env: {
        FORCE_COLOR: true
      }
    };
    const buildArgvOptions = {
      useEquals: false
    };

    return pSettle(
      tasks.map((task) => {
        const modifiedArgv = buildArgv({
          ...parsedArgv,
          _: [
            task.name,
            ...parsedArgv._.slice(1)
          ]
        }, buildArgvOptions);
        const spawnArgs = [ startCommand, ...modifiedArgv ];

        return execa(spawnCommand, spawnArgs, spawnOptions)
          .then(({ stdout }) => console.log(stdout))
          .catch((error) => {
            console.error(error);

            return Promise.reject();
          });
      })
    )
    .then((result) => {
      const hasRejected = result.some((item) => item.isRejected);

      if (hasRejected) {
        return Promise.reject();
      }
    });
  };
};
