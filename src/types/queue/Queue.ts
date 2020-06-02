import { createIsPausedFC } from './Queue.isPaused';
import { createJobCountFC } from './Queue.jobCounts';
import { createRepeatablesFC } from './Queue.repeatables';
import { createJobsFC } from './Queue.jobs';
import { createWaitingJobsFC } from './Queue.waitingJobs';
import { createCompletedJobsFC } from './Queue.completedJobs';
import { createActiveJobsFC } from './Queue.activeJobs';
import { createDelayedJobsFC } from './Queue.delayedJobs';
import { createFailedJobsFC } from './Queue.failedJobs';
import { createWorkersTC } from './Queue.workers';
import { createDurationAvgFC } from './Queue.durationAvg';
import { createJobsMemoryUsageAvgFC } from './Queue.jobsMemoryUsageAvg';
import { SchemaComposer } from 'graphql-compose';
import { Options } from '../../definitions';

export function getQueueTC(sc: SchemaComposer<any>, opts: Options) {
  const { typePrefix } = opts;

  return sc.getOrCreateOTC(`${typePrefix}Queue`, (etc) => {
    etc.addFields({
      name: 'String!',
      isPaused: createIsPausedFC(),
      jobCounts: createJobCountFC(sc, opts),
      repeatables: createRepeatablesFC(sc, opts),
      jobs: createJobsFC(sc, opts),
      jobsWaiting: createWaitingJobsFC(sc, opts),
      jobsCompleted: createCompletedJobsFC(sc, opts),
      jobsActive: createActiveJobsFC(sc, opts),
      jobsDelayed: createDelayedJobsFC(sc, opts),
      jobsFailed: createFailedJobsFC(sc, opts),
      activeWorkers: createWorkersTC(sc, opts),
      durationAvg: createDurationAvgFC(sc, opts),
      jobsMemoryUsageAvg: createJobsMemoryUsageAvgFC(sc, opts),
    });
  });
}
