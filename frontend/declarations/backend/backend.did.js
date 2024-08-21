export const idlFactory = ({ IDL }) => {
  const TopicId = IDL.Nat;
  const ReplyId = IDL.Nat;
  const Result_1 = IDL.Variant({ 'ok' : ReplyId, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : TopicId, 'err' : IDL.Text });
  const Time = IDL.Int;
  const Reply = IDL.Record({
    'id' : ReplyId,
    'content' : IDL.Text,
    'timestamp' : Time,
    'topicId' : TopicId,
  });
  const Topic = IDL.Record({
    'id' : TopicId,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'timestamp' : Time,
    'category' : IDL.Text,
  });
  return IDL.Service({
    'addReply' : IDL.Func([TopicId, IDL.Text], [Result_1], []),
    'addTopic' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
    'getCategories' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getReplies' : IDL.Func([TopicId], [IDL.Vec(Reply)], ['query']),
    'getTopics' : IDL.Func([IDL.Text], [IDL.Vec(Topic)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
