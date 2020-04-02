export default function ({ JobOptionsTC, CronRepeatOptionsTC }) {
  const JobOptionsInputTC = JobOptionsTC.getITC();

  JobOptionsInputTC.removeField('repeat');
  JobOptionsInputTC.addFields({
    repeat: CronRepeatOptionsTC.getITC(),
  });

  return {
    JobOptionsInputTC,
  };
}
