# name: nixie-plugin
# about: For client @nixie
# version: 0.1
# authors: Vinoth Kannan (vinothkannan@vinkas.com)
# url: https://github.com/vinkashq/nixie-plugin

after_initialize do

  PostActionType.class_eval do

    def self.types
      @types ||= Enum.new(bookmark: 1,
                          like: 2,
                          off_topic: 3,
                          inappropriate: 4,
                          vote: 5,
                          notify_moderators: 7,
                          spam: 8)
    end

  end

  if defined?(UserAction::SOLVED)
    require_dependency 'group_user_serializer'
    class ::GroupUserSerializer
      attributes :solved_count, :post_count

      def solved_count
        UserAction
          .where(user: object)
          .where(action_type: UserAction::SOLVED)
          .count
      end
    end
  end

end
