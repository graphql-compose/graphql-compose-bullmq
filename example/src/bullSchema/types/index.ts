import createScalarTypes from './scalarTypes';
import createEnums from './enums';
import createOutputTypes from './outputTypes';
import createInputTypes from './inputTypes';

export default function ({ schemaComposer }) {
  const { UIntTC, BoolOrUIntTC } = createScalarTypes({ schemaComposer });
  const UIntNonNullTC = UIntTC.getTypeNonNull();
  const { StatusEnumTC } = createEnums({ schemaComposer });

  const { CronRepeatOptionsTC, JobOptionsTC, JobTC, QueueTC } = createOutputTypes({
    schemaComposer,
    UIntTC,
    UIntNonNullTC,
    BoolOrUIntTC,
    StatusEnumTC,
  });

  const { JobOptionsInputTC } = createInputTypes({
    JobOptionsTC,
    CronRepeatOptionsTC,
  });

  return {
    UIntTC,
    BoolOrUIntTC,
    StatusEnumTC,
    CronRepeatOptionsTC,
    JobOptionsTC,
    JobTC,
    QueueTC,
    JobOptionsInputTC,
  };
}
