import { createJobCountFC } from './jobCounts';
import { createRepeatablesFC } from './repeatables';
import { createJobsFC } from './jobs';
import { createWaitingJobsFC } from './waitingJobs';
import { createCompletedJobsFC } from './completedJobs';
import { createActiveJobsFC } from './activeJobs';
import { createDelayedJobsFC } from './delayedJobs';
import { createFailedJobsFC } from './failedJobs';
import { SchemaComposer } from 'graphql-compose';

export function getQueueTC(sc: SchemaComposer<any>) {
  return sc.getOrCreateOTC('Queue', (etc) => {
    etc.addFields({
      hostId: 'String',
      name: 'String!',
      jobNames: '[String!]',
      jobCounts: createJobCountFC(sc),
      repeatables: createRepeatablesFC(sc),
      jobs: createJobsFC(sc),
      waitingJobs: createWaitingJobsFC(sc),
      completedJobs: createCompletedJobsFC(sc),
      activeJobs: createActiveJobsFC(sc),
      delayedJobs: createDelayedJobsFC(sc),
      failedJobs: createFailedJobsFC(sc),
    });
  });
}
