/**
 * Lightweight in-memory profile store to mimic a backend profile record.
 * Keeps starting balances consistent across screens until a real DB is wired.
 */

export type UserProfile = {
  cash: number;
  invested: number;
};

let profile: UserProfile = {
  cash: 10000,
  invested: 0,
};

export function getProfile(): UserProfile {
  return profile;
}

export function updateProfile(partial: Partial<UserProfile>): UserProfile {
  profile = { ...profile, ...partial };
  return profile;
}

export function resetProfile(): UserProfile {
  profile = { cash: 10000, invested: 0 };
  return profile;
}
