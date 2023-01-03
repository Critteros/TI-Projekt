type ExitHandlerOptions = {
  exit: boolean;
};
const exitHandler =
  ({ exit }: ExitHandlerOptions) =>
  (err: Error) => {
    if (err && err.stack) {
      process.stdout.write(err.stack);
    }
    if (exit) {
      process.stdout.write('Shutting down');
      process.exit(1);
    }
  };

// catches ctrl+c event
process.on('SIGINT', exitHandler({ exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler({ exit: true }));
process.on('SIGUSR2', exitHandler({ exit: true }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler({ exit: true }));
process.on('unhandledRejection', exitHandler({ exit: false }));

export {};
