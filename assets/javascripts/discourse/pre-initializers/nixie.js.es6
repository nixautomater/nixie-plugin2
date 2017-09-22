import TopicController from 'discourse/controllers/topic';
import Quote from 'discourse/lib/quote';
import Composer from 'discourse/models/composer';

export default {
  name: 'apply-nixie',
  initialize() {

    TopicController.reopen({
      actions: {
        replyToPost(post) {
          post = null;
          const composerController = this.get('composer');
          const topic = post ? post.get('topic') : this.get('model');

          const quoteState = this.get('quoteState');
          const postStream = this.get('model.postStream');
          if (!postStream) return;
          const quotedPost = postStream.findLoadedPost(quoteState.postId);
          const quotedText = Quote.build(quotedPost, quoteState.buffer);

          quoteState.clear();

          if (composerController.get('content.topic.id') === topic.get('id') &&
              composerController.get('content.action') === Composer.REPLY) {
            composerController.set('content.post', post);
            composerController.set('content.composeState', Composer.OPEN);
            this.appEvents.trigger('composer:insert-block', quotedText.trim());
          } else {

            const opts = {
              action: Composer.REPLY,
              draftKey: topic.get('draft_key'),
              draftSequence: topic.get('draft_sequence')
            };

            if (quotedText) { opts.quote = quotedText; }

            if(post && post.get("post_number") !== 1){
              opts.post = post;
            } else {
              opts.topic = topic;
            }

            composerController.open(opts);
          }
          return false;
        }
      }
    });
  }
};
