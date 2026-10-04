import { expect, test } from "bun:test";
import { sortJsonKeys } from "./sort-json-keys";
import { createHmacSigningService } from "./create-hmac-signing-service";

test("verifies an empty object", () => {
  const service = createHmacSigningService("signing-verification-fixture");

  expect(
    service.verify({}, "ad783135b3bade4d6a8edc3ee66d452b6bc7a02e780ffd273b15768e632995ba"),
  ).toBe(true);
});

test("verifies a message", () => {
  const service = createHmacSigningService("signing-verification-fixture");
  const input = {
    data: { message: "Hello World", timestamp: 1616161616 },
    signature: "c97fc4330cc945ea557806628cdd76cb28b829fd39f8445926dc35d3357b88d3",
  };

  expect(service.verify(input.data, input.signature)).toBe(true);
});

test("verifies string and number message values with different signatures", () => {
  const service = createHmacSigningService("signing-verification-fixture");
  const stringInput = { message: "Hello" };
  const numberInput = { message: 1616161616 };
  const stringSignature = "bb6008bc505bad88b67fb82768e8f0acdd8785e9b006ffd595d69c963df9d908";
  const numberSignature = "f9c0875a2e27085367f8918447b9f385405e2df53262595b43008d37e1cf037a";

  expect(service.verify(stringInput, stringSignature)).toBe(true);
  expect(service.verify(numberInput, numberSignature)).toBe(true);
  expect(service.verify(numberInput, stringSignature)).toBe(false);
  expect(service.verify(stringInput, numberSignature)).toBe(false);
});

test("verifies canonicalized objects with reordered properties identically", () => {
  const service = createHmacSigningService("signing-verification-fixture");
  const input = { count: 1, message: "hello" };
  const reorderedInput = { message: "hello", count: 1 };
  const signature = "15ac34eb3623796c46b5c627f21660548901c9cfc071a37edebd8e69401ab275";

  expect(service.verify(sortJsonKeys(input), signature)).toBe(true);
  expect(service.verify(sortJsonKeys(reorderedInput), signature)).toBe(true);
});

test("verifies canonicalized nested objects with reordered properties identically", () => {
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

  expect(service.verify(sortJsonKeys(input), signature)).toBe(true);
  expect(service.verify(sortJsonKeys(reorderedInput), signature)).toBe(true);
});
