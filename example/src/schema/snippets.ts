// function composeQueue(opts: {
//   schemaComposer?: SchemaComposer<any>;
//   typePrefix: string;
//   jobDataTC: string | ObjectTypeComposer<any, any>;
//   queue: {
//     name: string;
//     prefix: string;
//   };
// }): {
//   QueueTC: ObjectTypeComposer<any, any>;
//   queryFields: ObjectTypeComposerFieldConfigMapDefinition<any, any>;
//   mutationFields: ObjectTypeComposerFieldConfigMapDefinition<any, any>;
// } {
//   const sc = opts?.schemaComposer || schemaComposer;
//   return {
//     QueueTC: getQueueTC(schemaComposer),
//     queryFields: createQueryFields(schemaComposer, {
//       typePrefix,
//       JobDataTC: JobDataMetricCalcTC,
//     }),
//     mutationFields: createMutationFields(schemaComposer),
//   };
// }
