import 'global-jsdom/register';
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import React, { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTemplates } from "../useTemplates.ts";

describe("useTemplates", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it("should fetch and return templates", async () => {
    const { result } = renderHook(() => useTemplates(), { wrapper });

    assert.strictEqual(result.current.isLoading, true);

    await waitFor(() => {
      assert.strictEqual(result.current.isSuccess, true);
    });

    assert.ok(result.current.data);
    assert.strictEqual(result.current.data?.length, 2);
    assert.strictEqual(result.current.data[0].id, "uuid-template-1");
  });
});
