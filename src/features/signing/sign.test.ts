import { expect, test } from "bun:test";
import { sortJsonKeys } from "./canonical-json";
import { createHmacSigningService } from "./hmac-signing.service";

test("signs an empty object", () => {
  const service = createHmacSigningService("signing-verification-fixture");

  expect(service.sign({})).toBe("ad783135b3bade4d6a8edc3ee66d452b6bc7a02e780ffd273b15768e632995ba");
});

test("signs a message", () => {
  const service = createHmacSigningService("signing-verification-fixture");

  expect(service.sign({ message: "Hello World", timestamp: 1616161616 })).toBe(
    "c97fc4330cc945ea557806628cdd76cb28b829fd39f8445926dc35d3357b88d3",
  );
});

test("signs string and number message values differently", () => {
  const service = createHmacSigningService("signing-verification-fixture");

  expect(service.sign({ message: "Hello" })).not.toBe(service.sign({ message: 1616161616 }));
});

test("signs canonicalized objects with reordered properties identically", () => {
  const service = createHmacSigningService("signing-verification-fixture");
  const input = { count: 1, message: "hello" };
  const reorderedInput = { message: "hello", count: 1 };
  const signature = "15ac34eb3623796c46b5c627f21660548901c9cfc071a37edebd8e69401ab275";

  expect(service.sign(sortJsonKeys(input))).toBe(signature);
  expect(service.sign(sortJsonKeys(reorderedInput))).toBe(signature);
});

test("signs canonicalized nested objects with reordered properties identically", () => {
  const service = createHmacSigningService("signing-verification-fixture");
  const input = {
    profile: { lastName: "Doe", firstName: "Jane" },
    id: 7,
  };
  const reorderedInput = {
    id: 7,
    profile: { firstName: "Jane", lastName: "Doe" },
  };
  const signature = "dbc44a41acd54c39fc57f27385fbfd90c28223c5cfbe1a16cb3c220a82302b0e";

  expect(service.sign(sortJsonKeys(input))).toBe(signature);
  expect(service.sign(sortJsonKeys(reorderedInput))).toBe(signature);
});
