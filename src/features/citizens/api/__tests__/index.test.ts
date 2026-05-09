import { fetchCitizens } from '../index';

describe('fetchCitizens', () => {
  it('should fetch all citizens when no filters are provided', async () => {
    const citizens = await fetchCitizens();
    expect(citizens.length).toBeGreaterThanOrEqual(2);
    expect(citizens.some(c => c.fullName === 'Ahmad Subarjo')).toBe(true);
  });

  it('should filter by search name (case insensitive)', async () => {
    const citizens = await fetchCitizens({ search: 'ahmad' });
    expect(citizens.length).toBe(1);
    expect(citizens[0].fullName).toBe('Ahmad Subarjo');
  });

  it('should filter by NIK', async () => {
    const citizens = await fetchCitizens({ nik: '3273010101010002' });
    expect(citizens.length).toBe(1);
    expect(citizens[0].nik).toBe('3273010101010002');
  });

  it('should filter by RT', async () => {
    const citizens = await fetchCitizens({ rt: '01' });
    expect(citizens.every(c => c.rt === '01')).toBe(true);
  });

  it('should filter by RW', async () => {
    const citizens = await fetchCitizens({ rw: '01' });
    expect(citizens.length).toBeGreaterThanOrEqual(2);
    expect(citizens.every(c => c.rw === '01')).toBe(true);
  });

  it('should filter by birth date range (start)', async () => {
    const citizens = await fetchCitizens({ birthDateStart: '1982-01-01' });
    expect(citizens.length).toBe(1);
    expect(citizens[0].fullName).toBe('Siti Aminah');
  });

  it('should filter by birth date range (end)', async () => {
    const citizens = await fetchCitizens({ birthDateEnd: '1982-01-01' });
    expect(citizens.length).toBe(1);
    expect(citizens[0].fullName).toBe('Ahmad Subarjo');
  });

  it('should return empty array when no matches found', async () => {
    const citizens = await fetchCitizens({ search: 'NonExistent' });
    expect(citizens.length).toBe(0);
  });
});
