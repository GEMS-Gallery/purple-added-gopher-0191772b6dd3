import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import List "mo:base/List";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Option "mo:base/Option";

actor {
  // Types
  type TopicId = Nat;
  type Topic = {
    id: TopicId;
    category: Text;
    title: Text;
    content: Text;
    timestamp: Time.Time;
  };

  type ReplyId = Nat;
  type Reply = {
    id: ReplyId;
    topicId: TopicId;
    content: Text;
    timestamp: Time.Time;
  };

  // Stable variables
  stable var categories : [Text] = ["Cryptography", "Network Security", "Web Exploitation", "Reverse Engineering"];
  stable var nextTopicId : Nat = 0;
  stable var nextReplyId : Nat = 0;

  // Mutable state
  let topics = HashMap.HashMap<TopicId, Topic>(10, Nat.equal, Hash.hash);
  let replies = HashMap.HashMap<TopicId, [Reply]>(10, Nat.equal, Hash.hash);

  // Helper functions
  func createTopic(category: Text, title: Text, content: Text) : Topic {
    let id = nextTopicId;
    nextTopicId += 1;
    {
      id = id;
      category = category;
      title = title;
      content = content;
      timestamp = Time.now();
    }
  };

  func createReply(topicId: TopicId, content: Text) : Reply {
    let id = nextReplyId;
    nextReplyId += 1;
    {
      id = id;
      topicId = topicId;
      content = content;
      timestamp = Time.now();
    }
  };

  // Public functions
  public query func getCategories() : async [Text] {
    categories
  };

  public shared(msg) func addTopic(category: Text, title: Text, content: Text) : async Result.Result<TopicId, Text> {
    if (Array.find(categories, func(c: Text) : Bool { c == category }) == null) {
      return #err("Invalid category");
    };
    let topic = createTopic(category, title, content);
    topics.put(topic.id, topic);
    #ok(topic.id)
  };

  public query func getTopics(category: Text) : async [Topic] {
    let topicList = Iter.toArray(topics.vals());
    Array.filter(topicList, func(t: Topic) : Bool { t.category == category })
  };

  public shared(msg) func addReply(topicId: TopicId, content: Text) : async Result.Result<ReplyId, Text> {
    switch (topics.get(topicId)) {
      case null { #err("Topic not found") };
      case (?_) {
        let reply = createReply(topicId, content);
        let topicReplies = Option.get(replies.get(topicId), []);
        replies.put(topicId, Array.append(topicReplies, [reply]));
        #ok(reply.id)
      };
    }
  };

  public query func getReplies(topicId: TopicId) : async [Reply] {
    Option.get(replies.get(topicId), [])
  };
}
