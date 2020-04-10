import { createJobCountFC } from './Queue.jobCounts';
import { createRepeatablesFC } from './Queue.repeatables';
import { createJobsFC } from './Queue.jobs';
import { createWaitingJobsFC } from './Queue.waitingJobs';
import { createCompletedJobsFC } from './Queue.completedJobs';
import { createActiveJobsFC } from './Queue.activeJobs';
import { createDelayedJobsFC } from './Queue.delayedJobs';
import { createFailedJobsFC } from './Queue.failedJobs';
import { createWorkersTC } from './Queue.workers';
import { SchemaComposer } from 'graphql-compose';

export function getQueueTC(sc: SchemaComposer<any>) {
  return sc.getOrCreateOTC('Queue', (etc) => {
    etc.addFields({
      name: 'String!',
      jobCounts: createJobCountFC(sc),
      repeatables: createRepeatablesFC(sc),
      jobs: createJobsFC(sc),
      jobsWaiting: createWaitingJobsFC(sc),
      jobsCompleted: createCompletedJobsFC(sc),
      jobsActive: createActiveJobsFC(sc),
      jobsDelayed: createDelayedJobsFC(sc),
      jobsFailed: createFailedJobsFC(sc),
      activeWorkers: createWorkersTC(sc),
    });
  });
}
