import { describe, it } from "node:test";
import assert from "node:assert";
import { citizenSchema } from "../schema.ts";

const validCitizen = {
  nik: "3273010101010002",
  fullName: "Ahmad Subarjo",
  address: "Jl. Merdeka No. 1",
  rt: "01",
  rw: "01",
  gender: "L" as const,
  birthPlace: "Bandung",
  birthDate: "1980-01-01",
  religion: "Islam",
  occupation: "PNS",
  maritalStatus: "Kawin"
};

describe("citizenSchema", () => {
  describe("Valid data", () => {
    it("should validate a valid citizen object", () => {
      const result = citizenSchema.safeParse(validCitizen);
      assert.strictEqual(result.success, true);
    });
  });

  describe("NIK validation", () => {
    it("should fail if NIK is not exactly 16 digits", () => {
      const shortNik = { ...validCitizen, nik: "123" };
      const longNik = { ...validCitizen, nik: "12345678901234567" };

      let result = citizenSchema.safeParse(shortNik);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues.some(e => e.message === "NIK harus 16 digit"));
      }

      result = citizenSchema.safeParse(longNik);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues.some(e => e.message === "NIK harus 16 digit"));
      }
    });

    it("should fail if NIK contains non-digits", () => {
      const invalidNik = { ...validCitizen, nik: "123456789012345a" };
      const result = citizenSchema.safeParse(invalidNik);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues.some(e => e.message === "NIK harus berupa angka saja"));
      }
    });

    it("should fail if 7th digit of NIK is 8 or 9", () => {
      // Index 6 is the 7th digit
      const invalidNik8 = { ...validCitizen, nik: "3273018101010002" };
      const invalidNik9 = { ...validCitizen, nik: "3273019101010002" };

      let result = citizenSchema.safeParse(invalidNik8);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues.some(e => e.message.includes("Format NIK tidak valid")));
      }

      result = citizenSchema.safeParse(invalidNik9);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues.some(e => e.message.includes("Format NIK tidak valid")));
      }
    });

    it("should fail if 9th digit of NIK is not 0 or 1", () => {
      // Index 8 is the 9th digit
      const invalidNik2 = { ...validCitizen, nik: "3273010121010002" };
      const invalidNik5 = { ...validCitizen, nik: "3273010151010002" };

      let result = citizenSchema.safeParse(invalidNik2);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues.some(e => e.message.includes("Format NIK tidak valid")));
      }

      result = citizenSchema.safeParse(invalidNik5);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues.some(e => e.message.includes("Format NIK tidak valid")));
      }
    });

    it("should pass if 7th digit is not 8 or 9 AND 9th digit is 0 or 1", () => {
      const validNik1 = { ...validCitizen, nik: "3273010101010002" }; // 7th: 0, 9th: 0
      const validNik2 = { ...validCitizen, nik: "3273017111010002" }; // 7th: 7, 9th: 1

      assert.strictEqual(citizenSchema.safeParse(validNik1).success, true);
      assert.strictEqual(citizenSchema.safeParse(validNik2).success, true);
    });
  });

  describe("Birth date validation", () => {
    it("should fail if birth date is in the future", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const invalidDate = { ...validCitizen, birthDate: tomorrow.toISOString().split('T')[0] };

      const result = citizenSchema.safeParse(invalidDate);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues.some(e => e.message.includes("Tanggal lahir tidak valid")));
      }
    });

    it("should fail if birth date is before 1900", () => {
      const invalidDate = { ...validCitizen, birthDate: "1899-12-31" };

      const result = citizenSchema.safeParse(invalidDate);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues.some(e => e.message.includes("Tanggal lahir tidak valid")));
      }
    });

    it("should pass if birth date is today", () => {
      const today = new Date();
      const validDate = { ...validCitizen, birthDate: today.toISOString().split('T')[0] };

      assert.strictEqual(citizenSchema.safeParse(validDate).success, true);
    });

    it("should pass if birth date is 1900-01-01", () => {
      const validDate = { ...validCitizen, birthDate: "1900-01-01" };

      assert.strictEqual(citizenSchema.safeParse(validDate).success, true);
    });
  });

  describe("Required fields validation", () => {
    it("should fail if required string fields are empty", () => {
      const invalidCitizen = { ...validCitizen, fullName: "" };

      const result = citizenSchema.safeParse(invalidCitizen);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.issues.some(e => e.message === "Nama minimal 3 karakter"));
      }
    });
  });
});
