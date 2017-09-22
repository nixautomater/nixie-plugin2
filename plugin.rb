# name: nixie-plugin
# about: For client @nixie
# version: 0.1
# authors: Vinoth Kannan (vinothkannan@vinkas.com)
# url: https://github.com/vinkashq/nixie-plugin

after_initialize do

  if defined?(UserAction::SOLVED)
    require_dependency 'group_user_serializer'
    class ::GroupUserSerializer
      attributes :solved_count

      def solved_count
        UserAction
          .where(user: object)
          .where(action_type: UserAction::SOLVED)
          .count
      end
    end
  end

end
