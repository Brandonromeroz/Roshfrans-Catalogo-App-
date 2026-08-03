import { useCallback, useEffect } from 'react';
import { useHistoryStore } from '@/store/historyStore';

export const useHistory = () => {
  const history = useHistoryStore((s) => s.history);
  const isLoading = useHistoryStore((s) => s.isLoading);
  const isReady = useHistoryStore((s) => s.isReady);
  const loadHistory = useHistoryStore((s) => s.loadHistory);
  const addToHistory = useHistoryStore((s) => s.addToHistory);
  const removeFromHistory = useHistoryStore((s) => s.removeFromHistory);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const add = useCallback(
    async (query: string) => {
      await addToHistory(query);
    },
    [addToHistory],
  );

  const remove = useCallback(
    async (query: string) => {
      await removeFromHistory(query);
    },
    [removeFromHistory],
  );

  const clear = useCallback(async () => {
    await clearHistory();
  }, [clearHistory]);

  return {
    history,
    isLoading,
    isReady,
    addToHistory: add,
    removeFromHistory: remove,
    clearHistory: clear,
    hasHistory: history.length > 0,
  };
};
