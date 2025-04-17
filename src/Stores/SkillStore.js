// src/Stores/SkillStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./AuthStore";

export const useSkillStore = create(
  persist(
    (set, get) => ({
      allUserData: {},

      unlockSkill: (category, skillId, amount = 5) => {
        const username = useAuthStore.getState().user?.username;
        if (!username) return;

        const userData = get().allUserData[username] || {
          xpData: { push: 0, pull: 0, core: 0, legs: 0 },
          unlockedSkills: { push: [], pull: [], core: [], legs: [] },
        };

        if (userData.unlockedSkills[category]?.includes(skillId)) return;

        const updatedUserData = {
          xpData: {
            ...userData.xpData,
            [category]: (userData.xpData[category] || 0) + amount,
          },
          unlockedSkills: {
            ...userData.unlockedSkills,
            [category]: [...userData.unlockedSkills[category], skillId],
          },
        };

        set((state) => ({
          allUserData: {
            ...state.allUserData,
            [username]: updatedUserData,
          },
        }));
      },

      resetAll: () => {
        const username = useAuthStore.getState().user?.username;
        if (!username) return;

        set((state) => ({
          allUserData: {
            ...state.allUserData,
            [username]: {
              xpData: { push: 0, pull: 0, core: 0, legs: 0 },
              unlockedSkills: { push: [], pull: [], core: [], legs: [] },
            },
          },
        }));
      },

      getXpData: () => {
        const username = useAuthStore.getState().user?.username;
        return get().allUserData[username]?.xpData || { push: 0, pull: 0, core: 0, legs: 0 };
      },

      getUnlockedSkills: () => {
        const username = useAuthStore.getState().user?.username;
        const userData = get().allUserData[username];

        if (!userData) {
          const emptyData = {
            xpData: { push: 0, pull: 0, core: 0, legs: 0 },
            unlockedSkills: { push: [], pull: [], core: [], legs: [] },
          };
          set((state) => ({
            allUserData: { ...state.allUserData, [username]: emptyData }
          }));
          return emptyData.unlockedSkills;
        }

        return {
          push: [],
          pull: [],
          core: [],
          legs: [],
          ...userData.unlockedSkills,
        };
      },
    }),
    { name: "multi-user-skill-store" }
  )
);
