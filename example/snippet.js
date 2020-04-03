const QueueNotFoundProblemTC = schemaComposer.createObjectTC({
  name: 'QueueNotFoundProblem',
  fields: {
    name: 'String!',
    message: 'String',
  },
});

const JobNotFoundProblemTC = schemaComposer.createObjectTC({
  name: 'JobNotFoundProblem',
  fields: {
    queueName: 'String!',
    id: 'String!',
    message: 'String',
  },
});

const UnknownJobNameProblemTC = schemaComposer.createObjectTC({
  name: 'UnknownJobNameProblem',
  fields: {
    queueName: 'String!',
    jobName: 'String!',
    message: 'String',
  },
});

const createQueueNotFoundProblem = (queueName) => ({
  type: QueueNotFoundProblemTC.getTypeName(),
  name: queueName,
  message: `Queue by name ${queueName} not found!`,
});

const createJobNotFoundProblem = (queueName, jobId) => ({
  type: JobNotFoundProblemTC.getTypeName(),
  queueName,
  id: jobId,
  message: `Job by id ${jobId} not found in queue ${queueName}!`,
});

const createUnknownJobNameProblem = (queueName, jobName) => ({
  type: UnknownJobNameProblemTC.getTypeName(),
  queueName,
  jobName,
  message: `Job by name ${jobName} not found in queue ${queueName}!`,
});
