export const filterOldPaymentsOrParticipants = (ids: string[]) => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  return ids.filter((id) => {
    // Find the first sequence of 10+ digits (to match a timestamp)
    const match = id.match(/(\d{10,})/);
    if (!match) return true; // keep if no timestamp found
    const timestamp = Number(match[1]);
    return now - timestamp < oneDay;
  });
};
