import { expect, test } from "bun:test";
import { createBase64EncryptionService } from "./create-base64-encryption-service";
import { encryptFields } from "./encrypt-fields";

const base64EncryptionService = createBase64EncryptionService();

test("encodes an empty input to an empty object", () => {
  expect(encryptFields({}, base64EncryptionService)).toEqual({});
});

test("encodes a string value as JSON before Base64", () => {
  const result = encryptFields({ name: "John Doe" }, base64EncryptionService);

  expect(result).toEqual({ name: "IkpvaG4gRG9lIg==" });
});

test("encodes a number value as JSON before Base64", () => {
  const result = encryptFields({ age: 42 }, base64EncryptionService);

  expect(result).toEqual({ age: "NDI=" });
});

test("encodes a nested object as one value", () => {
  const result = encryptFields(
    {
      contact: {
        email: "john@example.com",
        phone: "123-456-7890",
      },
    },
    base64EncryptionService,
  );

  expect(result).toEqual({
    contact: "eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9",
  });
});

test("encodes each top-level value in a mixed payload", () => {
  const result = encryptFields(
    {
      name: "John Doe",
      age: 30,
      contact: {
        email: "john@example.com",
        phone: "123-456-7890",
      },
    },
    base64EncryptionService,
  );

  expect(result).toEqual({
    age: "MzA=",
    contact: "eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9",
    name: "IkpvaG4gRG9lIg==",
  });
});

test("encodes a boolean value", () => {
  const result = encryptFields({ active: false }, base64EncryptionService);

  expect(result).toEqual({ active: "ZmFsc2U=" });
});

test("encodes a null value", () => {
  const result = encryptFields({ value: null }, base64EncryptionService);

  expect(result).toEqual({ value: "bnVsbA==" });
});

test("encodes an empty string", () => {
  const result = encryptFields({ value: "" }, base64EncryptionService);

  expect(result).toEqual({ value: "IiI=" });
});

test("encodes an array as one top-level value", () => {
  const result = encryptFields({ value: [1, 2] }, base64EncryptionService);

  expect(result).toEqual({ value: "WzEsMl0=" });
});
