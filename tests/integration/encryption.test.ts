import { expect, test } from "bun:test";
import { createApp } from "@/app";
import { postJson } from "../utils/http";

const app = createApp();

test("POST /encrypt returns 400 for malformed JSON", async () => {
  const response = await postJson(app, "/encrypt", '{"name":');
  expect(response.status).toBe(400);
});

test("POST /decrypt returns 400 for malformed JSON", async () => {
  const response = await postJson(app, "/decrypt", '{"name":');
  expect(response.status).toBe(400);
});

test("POST /encrypt returns 400 when the JSON payload is an array", async () => {
  const response = await postJson(app, "/encrypt", "[1, 2, 3]");
  expect(response.status).toBe(400);
});

test("POST /decrypt returns 400 when the JSON payload is an array", async () => {
  const response = await postJson(app, "/decrypt", "[1, 2, 3]");
  expect(response.status).toBe(400);
});

test("POST /encrypt and /decrypt round-trip a nested object", async () => {
  const original = {
    name: "John Doe",
    age: 30,
    contact: {
      email: "john@example.com",
      phone: "123-456-7890",
    },
  };

  const encryptedResponse = await postJson(app, "/encrypt", JSON.stringify(original));
  const encrypted = await encryptedResponse.json();
  const decryptedResponse = await postJson(app, "/decrypt", JSON.stringify(encrypted));

  expect(encryptedResponse.status).toBe(200);
  expect(decryptedResponse.status).toBe(200);
  expect(await decryptedResponse.json()).toEqual(original);
});
