export default {
  getCoaches: (state) => state.coaches,
  hasCoaches: (state) => state.coaches && state.coaches.length > 0,
  filteredCoaches: (state) => state.coaches,
  getUserId: (state) => state.userId,
  isCoach() {
    const coaches = this.getCoaches;
    const userId = this.getUserId;
    return coaches.some((coach) => coach.id === userId);
  },
  getRequests: (state) => state.requests,
  getRequestsWithId: (state) =>
    state.requests.filter((request) => request.coachId === state.userId),

  hasRequests: (state) =>
    state.getRequestsWithId && state.getRequestsWithId.length > 0,
  shouldUpdate(state) {
    const lastFetch = state.lastFetch;
    if (!lastFetch) {
      return true;
    } else {
      const currentTimeStamp = new Date().getTime();
      return (currentTimeStamp - lastFetch) / 1000 > 60;
    }
  },
  //Auth:
  getToken: (state) => state.token,
  isAuthenticated(state) {
    return !!state.token;
  },
  didItAutoLogout(state) {
    state.didAutoLogout = true;
  },
};
