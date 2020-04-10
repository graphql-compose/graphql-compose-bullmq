import { createJobCountFC } from './jobCounts';
import { createRepeatablesFC } from './repeatables';
import { createJobsFC } from './jobs';
import { createWaitingJobsFC } from './waitingJobs';
import { createCompletedJobsFC } from './completedJobs';
import { createActiveJobsFC } from './activeJobs';
import { createDelayedJobsFC } from './delayedJobs';
import { createFailedJobsFC } from './failedJobs';
import { createWorkersTC } from './workers';
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
