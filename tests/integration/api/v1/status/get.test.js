import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  const pgVersion = responseBody.dependencies.database.postgres_version;
  expect(pgVersion).toEqual("16.0");

  const maxConnections = parseInt(
    responseBody.dependencies.database.max_connections,
  );
  expect(maxConnections).toEqual(100);

  const usedConnections = responseBody.dependencies.database.used_connections;
  expect(usedConnections).toEqual(1);
});
