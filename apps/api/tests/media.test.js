process.env.JWT_SECRET = "test-secret";
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "test-key";
process.env.CLOUDINARY_API_SECRET = "test-secret";

const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/api/media", require("../routes/mediaRoutes"));
app.use(require("../middleware/errorHandler"));

const token = jwt.sign({ id: "test-admin", role: "admin" }, "test-secret");
const auth = (req) => req.set("Authorization", `Bearer ${token}`);

// Minimal valid JPEG header so the magic-number check passes
const fakeJpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(16)]);

describe("POST /api/media/images", () => {
  it("rejects requests without a token", async () => {
    const res = await request(app).post("/api/media/images");
    expect(res.status).toBe(401);
  });

  it("rejects requests with no files", async () => {
    const res = await auth(request(app).post("/api/media/images"));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/No files received/);
  });

  it("rejects folders outside the whitelist", async () => {
    const res = await auth(request(app).post("/api/media/images"))
      .field("folder", "../evil")
      .attach("images", fakeJpeg, "a.jpg");
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid folder/);
  });

  it("rejects files that are not real images (magic-number check)", async () => {
    const res = await auth(request(app).post("/api/media/images"))
      .field("folder", "treks")
      .attach("images", Buffer.from("MZ-definitely-not-an-image"), {
        filename: "evil.jpg",
        contentType: "image/jpeg",
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Not a valid image/);
  });

  it("rejects disallowed MIME types", async () => {
    const res = await auth(request(app).post("/api/media/images"))
      .field("folder", "treks")
      .attach("images", Buffer.from("hello"), {
        filename: "note.txt",
        contentType: "text/plain",
      });
    expect(res.status).toBe(400);
  });

  it("rejects files over the size limit", async () => {
    const res = await auth(request(app).post("/api/media/images"))
      .field("folder", "treks")
      .attach("images", Buffer.alloc(6 * 1024 * 1024, 1), {
        filename: "big.jpg",
        contentType: "image/jpeg",
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/too large/i);
  });
});

describe("DELETE /api/media/images", () => {
  it("rejects requests without a token", async () => {
    const res = await request(app).delete("/api/media/images").send({ publicId: "x" });
    expect(res.status).toBe(401);
  });

  it("requires a publicId", async () => {
    const res = await auth(request(app).delete("/api/media/images")).send({});
    expect(res.status).toBe(400);
  });

  it("refuses public IDs outside the app namespace", async () => {
    const res = await auth(request(app).delete("/api/media/images")).send({
      publicId: "someone-elses/asset",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid public ID/);
  });
});
