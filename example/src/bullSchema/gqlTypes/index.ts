import createScalarTypes from './scalarTypes';
import createEnums from './enums';
import createOutputTypes from './outputTypes';
import createInputTypes from './inputTypes';

export default function ({ schemaComposer }) {
  const { UIntTC, BoolOrUIntTC } = createScalarTypes({ schemaComposer });
  const UIntNonNullTC = UIntTC.getTypeNonNull();
  const { JobStatusEnumTC, PayloadStatusEnumTC, ErrorCodeEnumTC } = createEnums({ schemaComposer });

  const { CronRepeatOptionsTC, JobOptionsTC, JobTC, QueueTC } = createOutputTypes({
    schemaComposer,
    UIntTC,
    UIntNonNullTC,
    BoolOrUIntTC,
    JobStatusEnumTC,
  });

  const { JobOptionsInputTC } = createInputTypes({
    JobOptionsTC,
    CronRepeatOptionsTC,
  });

  return {
    UIntTC,
    BoolOrUIntTC,
    JobStatusEnumTC,
    PayloadStatusEnumTC,
    ErrorCodeEnumTC,
    CronRepeatOptionsTC,
    JobOptionsTC,
    JobTC,
    QueueTC,
    JobOptionsInputTC,
  };
}
