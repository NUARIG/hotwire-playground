module Redcap2omop
  module Methods
    module Models
      module RedcapDerivedDate
        OFFSET_INTERVAL_DIRECTION_PAST = 'Past'
        OFFSET_INTERVAL_DIRECTION_FUTURE = 'Future'
        OFFSET_INTERVAL_DIRECTIONS = [OFFSET_INTERVAL_DIRECTION_PAST, OFFSET_INTERVAL_DIRECTION_FUTURE]

        def self.included(base)
          # Associations
          base.send :belongs_to, :redcap_data_dictionary, class_name: 'RedcapDataDictionary'
          base.send :belongs_to, :base_date_redcap_variable,  class_name: 'RedcapVariable',    foreign_key: 'base_date_redcap_variable_id',  optional: true
          base.send :belongs_to, :offset_redcap_variable,     class_name: 'RedcapVariable',    foreign_key: 'offset_redcap_variable_id'
          base.send :has_many, :redcap_derived_date_choice_offset_mappings
          base.send :belongs_to, :parent_redcap_derived_date, class_name: 'RedcapDerivedDate', foreign_key: 'parent_redcap_derived_date_id', optional: true

          # Validations
          base.send :validates_presence_of, :offset_redcap_variable_id, :name
          base.send :validates_uniqueness_of, :name, scope: :redcap_data_dictionary_id

          base.send :include, InstanceMethods
          base.extend(ClassMethods)
        end

        module InstanceMethods
        end

        module ClassMethods
          def by_redcap_variable_child_map(redcap_variable_child_map)
            case redcap_variable_child_map.parentable_type
            when Redcap2omop::RedcapVariable.to_s
              redcap_derived_dates = Redcap2omop::RedcapDerivedDate.where(redcap_data_dictionary_id: redcap_variable_child_map.parentable.redcap_data_dictionary_id).order('name')
            when Redcap2omop::RedcapVariableChoice.to_s
              redcap_derived_dates = Redcap2omop::RedcapDerivedDate.where(redcap_data_dictionary_id: redcap_variable_child_map.parentable.redcap_variable.redcap_data_dictionary_id).order('name')
            end
          end
        end
      end
    end
  end
end