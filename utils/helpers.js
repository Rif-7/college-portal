function generateInitialSchedule(refField) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const schedule = {};

  days.forEach((day) => {
    const periodCount = day === "friday" ? 6 : 7;
    schedule[day] = Array(periodCount).fill({
      subjectCode: "",
      [refField]: null,
    });
  });

  return schedule;
}
