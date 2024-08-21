import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Reply {
  'id' : ReplyId,
  'content' : string,
  'timestamp' : Time,
  'topicId' : TopicId,
}
export type ReplyId = bigint;
export type Result = { 'ok' : TopicId } |
  { 'err' : string };
export type Result_1 = { 'ok' : ReplyId } |
  { 'err' : string };
export type Time = bigint;
export interface Topic {
  'id' : TopicId,
  'title' : string,
  'content' : string,
  'timestamp' : Time,
  'category' : string,
}
export type TopicId = bigint;
export interface _SERVICE {
  'addReply' : ActorMethod<[TopicId, string], Result_1>,
  'addTopic' : ActorMethod<[string, string, string], Result>,
  'getCategories' : ActorMethod<[], Array<string>>,
  'getReplies' : ActorMethod<[TopicId], Array<Reply>>,
  'getTopics' : ActorMethod<[string], Array<Topic>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
