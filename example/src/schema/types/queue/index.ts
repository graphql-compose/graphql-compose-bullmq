import { createJobCountFC } from './jobCounts';
import { createRepeatablesFC } from './repeatables';
import { createJobsFC } from './jobs';
import { createWaitingJobsFC } from './waitingJobs';
import { createCompletedJobsFC } from './completedJobs';
import { createActiveJobsFC } from './activeJobs';
import { createDelayedJobsFC } from './delayedJobs';
import { createFailedJobsFC } from './failedJobs';

export function createQueueTC(schemaComposer, { JobTC }) {
  return schemaComposer.createObjectTC({
    name: 'Queue',
    description: 'Bull queue',
    fields: {
      hostId: 'String',
      name: 'String!',
      jobNames: '[String!]',
      jobCounts: createJobCountFC(schemaComposer),
      repeatables: createRepeatablesFC(schemaComposer),
      jobs: createJobsFC({ JobTC }),
      waitingJobs: createWaitingJobsFC({ JobTC }),
      completedJobs: createCompletedJobsFC({ JobTC }),
      activeJobs: createActiveJobsFC({ JobTC }),
      delayedJobs: createDelayedJobsFC({ JobTC }),
      failedJobs: createFailedJobsFC({ JobTC }),
    },
  });
}
