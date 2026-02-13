const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  async function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      await sleep(1);
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n🟢 Postgres está pronto e aceitando conexões!");
  }
}

process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões");
checkPostgres();

async function sleep(segundos) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setTimeout(resolve, segundos * 1000));
}
