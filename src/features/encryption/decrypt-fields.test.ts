import { expect, test } from "bun:test";
import { base64EncryptionService } from "./base64-encryption.service";
import { decryptFields } from "./decrypt-fields";

test("decodes an empty input to an empty object", () => {
  expect(decryptFields({}, base64EncryptionService)).toEqual({});
});

test("decodes a string value", () => {
  const result = decryptFields({ name: "IkpvaG4gRG9lIg==" }, base64EncryptionService);

  expect(result).toEqual({ name: "John Doe" });
});

test("decodes a number value", () => {
  const result = decryptFields({ age: "NDI=" }, base64EncryptionService);

  expect(result).toEqual({ age: 42 });
});

test("decodes a nested object as one value", () => {
  const result = decryptFields(
    {
      contact: "eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9",
    },
    base64EncryptionService,
  );

  expect(result).toEqual({
    contact: {
      email: "john@example.com",
      phone: "123-456-7890",
    },
  });
});

test("decodes each top-level value in a mixed payload", () => {
  const result = decryptFields(
    {
      name: "IkpvaG4gRG9lIg==",
      age: "MzA=",
      contact: "eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9",
    },
    base64EncryptionService,
  );

  expect(result).toEqual({
    name: "John Doe",
    age: 30,
    contact: {
      email: "john@example.com",
      phone: "123-456-7890",
    },
  });
});

test("decodes a boolean value", () => {
  const result = decryptFields({ active: "ZmFsc2U=" }, base64EncryptionService);

  expect(result).toEqual({ active: false });
});

test("decodes a null value", () => {
  const result = decryptFields({ value: "bnVsbA==" }, base64EncryptionService);

  expect(result).toEqual({ value: null });
});

test("decodes an empty string value", () => {
  const result = decryptFields({ value: "IiI=" }, base64EncryptionService);

  expect(result).toEqual({ value: "" });
});

test("decodes an array value as one top-level value", () => {
  const result = decryptFields({ value: "WzEsMl0=" }, base64EncryptionService);

  expect(result).toEqual({ value: [1, 2] });
});

test("decodes an unencoded string unchanged", () => {
  const result = decryptFields({ note: "leave this text unchanged" }, base64EncryptionService);

  expect(result).toEqual({ note: "leave this text unchanged" });
});

test("decodes an unencoded integer unchanged", () => {
  const result = decryptFields({ age: 42 }, base64EncryptionService);

  expect(result).toEqual({ age: 42 });
});

test("decodes an unencoded nested object unchanged", () => {
  const contact = {
    email: "john@example.com",
    phone: "123-456-7890",
  };
  const result = decryptFields({ contact }, base64EncryptionService);

  expect(result).toEqual({ contact });
});
