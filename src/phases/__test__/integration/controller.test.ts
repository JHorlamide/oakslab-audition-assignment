import http from "http";
import supertest, { SuperAgentTest } from "supertest";

import main from "../../../server";

describe("createNewPhase", () => {
  let server: http.Server;
  let request: SuperAgentTest;

  beforeEach(async function () {
    server = main();
    request = supertest.agent(server);
  });

  afterEach(async function () {
    // shut down the Express.js server, then tell jest we're done:
    server.close();
  });

  it("it should create a new phase", async () => {
    let phaseId = "";
    let firstPhaseBody = {
      name: "test phase",
      description: "test description"
    }

    const res = await request.post("/api/phases").send(firstPhaseBody);

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toMatchObject({ status: "Success" });
    expect(res.body).toMatchObject({ message: "New phase created successfully" });
    phaseId = res.body.data.phaseId;
  })

  it("it should return an error if name and description are not provided", async () => {
    let errorPhaseBody = {
      name: "",
      description: ""
    }

    const res = await request.post("/api/phases").send(errorPhaseBody);

    expect(res.status).toEqual(400);
    expect(res.body).toMatchObject({ status: "Failure" });
    expect(res.body).toMatchObject({ message: "\"name\" is not allowed to be empty" });
  })
})