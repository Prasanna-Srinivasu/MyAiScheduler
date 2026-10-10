import { useState, useCallback, useEffect } from 'react';
import scheduleService from '../services/scheduleService';
import aiService from '../services/aiService';
import { useApp } from '../context/AppContext';
import { getTodayDateString } from '../utils/dateUtils';

export function useSchedule(selectedDate = getTodayDateString()) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { refreshKey, triggerRefresh, showToast } = useApp();

  const fetchSchedule = useCallback(async (date = selectedDate) => {
    setLoading(true);
    try {
      const data = await scheduleService.getDailySchedule(date);
      setSchedule(data);
    } catch (err) {
      console.error('Failed to fetch schedule:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule, refreshKey]);

  const generateWithAi = async (params) => {
    setGenerating(true);
    try {
      const result = await aiService.generateSchedule(params);
      showToast('AI schedule generated and applied successfully!', 'success');
      triggerRefresh();
      return result;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to generate schedule', 'error');
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  return {
    schedule,
    loading,
    generating,
    fetchSchedule,
    generateWithAi,
  };
}

export default useSchedule;
