import { describe, it } from "node:test";
import assert from "node:assert";
import { updateTemplate, fetchTemplates, createTemplate, deleteTemplate } from '../index.ts';

describe('updateTemplate', () => {
  it('should throw an error when updating a template with a non-existent ID', async () => {
    const nonExistentId = 'non-existent-id-123';
    const updateData = { name: 'Updated Name' };

    try {
      await updateTemplate(nonExistentId, updateData);
      assert.fail('Expected updateTemplate to throw an error');
    } catch (error: any) {
      assert.strictEqual(error.message, 'Template not found');
    }
  });

  it('should successfully update an existing template', async () => {
    // 1. Create a new template and update it.
    const newTemplate = await createTemplate({
      name: "Test Template",
      description: "Description",
      headerContent: "Header",
      content: "Content",
      isActive: true,
      fields: []
    });

    const updateData = { name: 'Updated Test Template Name' };
    const updatedTemplate = await updateTemplate(newTemplate.id, updateData);

    assert.strictEqual(updatedTemplate.name, 'Updated Test Template Name');
    assert.strictEqual(updatedTemplate.id, newTemplate.id);
    assert.ok(updatedTemplate.updatedAt > newTemplate.updatedAt || updatedTemplate.updatedAt === newTemplate.updatedAt);

    // Clean up
    await deleteTemplate(newTemplate.id);
  });
});
