import { expect, test } from "bun:test";
import { createApp } from "@/app";
import { postJson } from "../utils/http";

const app = createApp();

test("POST /verify returns 422 when signature is missing", async () => {
  const input = { data: { message: "Hello World", timestamp: 1616161616 } };

  const response = await postJson(app, "/verify", JSON.stringify(input));

  expect(response.status).toBe(422);
  expect(await response.json()).toEqual({ error: "Invalid request body" });
});

test("POST /verify returns 422 when data is called content", async () => {
  const input = {
    signature: "da90f80234298aa0069a10821c6bac4ce4e7e92aca94152b86f875ddf817729b",
    content: { message: "Hello World", timestamp: 1616161616 },
  };

  const response = await postJson(app, "/verify", JSON.stringify(input));

  expect(response.status).toBe(422);
  expect(await response.json()).toEqual({ error: "Invalid request body" });
});

test("POST /verify returns 204 for the correct signature", async () => {
  const data = { message: "Hello World", timestamp: 1616161616 };
  const signedResponse = await postJson(app, "/sign", JSON.stringify(data));
  const { signature } = await signedResponse.json();
  const response = await postJson(app, "/verify", JSON.stringify({ signature, data }));

  expect(signedResponse.status).toBe(200);
  expect(response.status).toBe(204);
  expect(await response.text()).toBe("");
});

test("POST /verify returns 400 for the wrong signature", async () => {
  const data = { message: "Hello World", timestamp: 1616161616 };
  const signature = "da90f80234298aa0069a10821c6bac4ce4e7e92aca94152b86f875ddf817729b";

  const response = await postJson(app, "/verify", JSON.stringify({ signature, data }));

  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: "Invalid signature" });
});

test("POST /verify returns 204 when data properties are reordered", async () => {
  const data = {
    message: "Hello World",
    timestamp: 1616161616,
    profile: { firstName: "Jane", lastName: "Doe" },
  };
  const signedResponse = await postJson(app, "/sign", JSON.stringify(data));
  const { signature } = await signedResponse.json();
  const reorderedData = {
    profile: { lastName: "Doe", firstName: "Jane" },
    timestamp: 1616161616,
    message: "Hello World",
  };

  const response = await postJson(
    app,
    "/verify",
    JSON.stringify({ signature, data: reorderedData }),
  );

  expect(signedResponse.status).toBe(200);
  expect(response.status).toBe(204);
  expect(await response.text()).toBe("");
});
