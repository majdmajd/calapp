import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSkillStore = create(
  persist(
    (set) => ({
      xpData: { push: 0, pull: 0, core: 0, legs: 0 },
      unlockedSkills: { push: [], pull: [], core: [], legs: [] },
      unlockSkill: (category, skillId, amount = 5) =>
        set((state) => {
          if (state.unlockedSkills[category]?.includes(skillId)) return state;
          return {
            xpData: {
              ...state.xpData,
              [category]: (state.xpData[category] || 0) + amount,
            },
            unlockedSkills: {
              ...state.unlockedSkills,
              [category]: [...state.unlockedSkills[category], skillId],
            },
          };
        }),
      resetAll: () =>
        set(() => ({
          xpData: { push: 0, pull: 0, core: 0, legs: 0 },
          unlockedSkills: { push: [], pull: [], core: [], legs: [] },
        })),
    }),
    { name: 'skill-storage' }
  )
);
