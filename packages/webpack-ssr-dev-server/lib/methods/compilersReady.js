async function compilersReady() {
  try {
    await this.compilerPromise.server;
    await this.compilerPromise.client;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  compilersReady
};
