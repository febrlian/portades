import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

// Mock global window and localStorage to avoid zustand persist warnings
const mockStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  length: 0,
  key: () => null,
  clear: () => {}
};
global.window = {
    localStorage: mockStorage
} as any;
global.localStorage = mockStorage as any;

import { useAuthStore } from "../auth.ts";
import { User } from "../../types/index.ts";

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it('should have correct initial state', () => {
    const state = useAuthStore.getState();
    assert.strictEqual(state.user, null);
    assert.strictEqual(state.token, null);
    assert.strictEqual(state.isAuthenticated, false);
  });

  it('should update state correctly on login', () => {
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "warga"
    };
    const mockToken = "mock-token-123";

    useAuthStore.getState().login(mockUser, mockToken);

    const state = useAuthStore.getState();
    assert.deepStrictEqual(state.user, mockUser);
    assert.strictEqual(state.token, mockToken);
    assert.strictEqual(state.isAuthenticated, true);
  });

  it('should reset state correctly on logout', () => {
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "warga"
    };
    const mockToken = "mock-token-123";

    // Set initial logged in state
    useAuthStore.setState({ user: mockUser, token: mockToken, isAuthenticated: true });

    // Perform logout
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    assert.strictEqual(state.user, null);
    assert.strictEqual(state.token, null);
    assert.strictEqual(state.isAuthenticated, false);
  });
});
