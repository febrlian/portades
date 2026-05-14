import { describe, it } from "node:test";
import assert from "node:assert";
import { fetchCitizens, updateCitizen } from '../index.ts';

describe('fetchCitizens', () => {
  it('should fetch all citizens when no filters are provided', async () => {
    const citizens = await fetchCitizens();
    assert.ok(citizens.length >= 2);
    assert.ok(citizens.some(c => c.fullName === 'Ahmad Subarjo'));
  });

  it('should filter by search name (case insensitive)', async () => {
    const citizens = await fetchCitizens({ search: 'ahmad' });
    assert.strictEqual(citizens.length, 1);
    assert.strictEqual(citizens[0].fullName, 'Ahmad Subarjo');
  });

  it('should filter by NIK', async () => {
    const citizens = await fetchCitizens({ nik: '3273010101010002' });
    assert.strictEqual(citizens.length, 1);
    assert.strictEqual(citizens[0].nik, '3273010101010002');
  });

  it('should filter by RT', async () => {
    const citizens = await fetchCitizens({ rt: '01' });
    assert.ok(citizens.every(c => c.rt === '01'));
  });

  it('should filter by RW', async () => {
    const citizens = await fetchCitizens({ rw: '01' });
    assert.ok(citizens.length >= 2);
    assert.ok(citizens.every(c => c.rw === '01'));
  });

  it('should filter by birth date range (start)', async () => {
    const citizens = await fetchCitizens({ birthDateStart: '1982-01-01' });
    assert.strictEqual(citizens.length, 1);
    assert.strictEqual(citizens[0].fullName, 'Siti Aminah');
  });

  it('should filter by birth date range (end)', async () => {
    const citizens = await fetchCitizens({ birthDateEnd: '1982-01-01' });
    assert.strictEqual(citizens.length, 1);
    assert.strictEqual(citizens[0].fullName, 'Ahmad Subarjo');
  });

  it('should return empty array when no matches found', async () => {
    const citizens = await fetchCitizens({ search: 'NonExistent' });
    assert.strictEqual(citizens.length, 0);
  });
});

describe('updateCitizen', () => {
  it('should throw an error when updating a non-existent citizen', async () => {
    const nonExistentId = 'non-existent-id-123';
    const updateData = {
      nik: "1234567890123456",
      fullName: "Test User",
      address: "Test Address",
      rt: "01",
      rw: "01",
      gender: "L" as const,
      birthPlace: "Test City",
      birthDate: "1990-01-01",
      religion: "Islam",
      occupation: "Test Occupation",
      maritalStatus: "Kawin",
    };

    await assert.rejects(
      async () => {
        await updateCitizen(nonExistentId, updateData);
      },
      (err: Error) => {
        assert.strictEqual(err.message, 'Not found');
        return true;
      }
    );
  });
});
