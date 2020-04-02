export interface QueueNotFoundProblem {
  type: string;
  name: string;
  message: string;
}

export interface JobNotFoundProblem {
  type: string;
  queueName: string;
  id: string;
  message: string;
}

export interface UnknownJobNameProblem {
  type: string;
  queueName: string;
  jobName: string;
  message: string;
}

export type CreateQueueNotFoundProblem = (queueName: string) => QueueNotFoundProblem;

export type CreateJobNotFoundProblem = (queueName: string, jobId: string) => JobNotFoundProblem;

export type CreateUnknownJobNameProblem = (
  queueName: string,
  jobName: string
) => UnknownJobNameProblem;
