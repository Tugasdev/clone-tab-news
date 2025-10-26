import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const getPostgresVersion = await database.query("SHOW server_version;");
  const postgresVersion = getPostgresVersion.rows[0].server_version;

  const getMaxConnections = await database.query("SHOW max_connections;");
  const maxConnections = getMaxConnections.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const getUsedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });
  const usedConnections = getUsedConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        postgres_version: postgresVersion,
        max_connections: parseInt(maxConnections),
        used_connections: usedConnections,
      },
    },
  });
}

export default status;
