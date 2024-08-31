const request = require("supertest");
const app = require("../app");

describe("POST /snaps", () => {
  it("Should create a new snap message", async () => {
    const response = await request(app)
      .post("/snaps")
      .send({ message: "Test message" })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toHaveProperty("title", "Snap created successfully");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("message", "Test message");
    expect(response.body.data).toHaveProperty("createdAt");
  });

  it("Should return 400 if message does not exist", async () => {
    const response = await request(app)
      .post("/snaps")
      .send({})
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toHaveProperty("type", "about:blank");
    expect(response.body).toHaveProperty(
      "title",
      "Your request parameters didn't validate."
    );
    expect(response.body["invalid-params"][0]).toHaveProperty(
      "name",
      "message"
    );
  });

  it("Should return 400 if message exceeds 280 characters", async () => {
    const longMessage = "x".repeat(281);
    const response = await request(app)
      .post("/snaps")
      .send({ message: longMessage })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toHaveProperty("type", "about:blank");
    expect(response.body).toHaveProperty(
      "title",
      "Your request parameters didn't validate."
    );
    expect(response.body["invalid-params"][0]).toHaveProperty(
      "name",
      "message"
    );
  });
});

describe("GET /snaps", () => {
  it("Should retrieve all snap messages", async () => {
    await request(app).post("/snaps").send({ message: "Test message" });

    const response = await request(app)
      .get("/snaps")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("title", "A list of snaps");
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).toHaveProperty("message", "Test message");
  });
});
