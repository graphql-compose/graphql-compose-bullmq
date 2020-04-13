import { ObjectTypeComposer } from 'graphql-compose';

export type Options = {
  typePrefix: string;
  jobDataTC?: string | ObjectTypeComposer<any, any>;
  queue?: {
    name: string;
    prefix: string;
  };
};
