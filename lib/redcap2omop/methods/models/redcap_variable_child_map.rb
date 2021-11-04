module Redcap2omop
  module Methods
    module Models
      module RedcapVariableChildMap
        REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_REDCAP_VARIABLE = 'REDCap Variable'
        REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_OMOP_CONCEPT = 'OMOP Concept'
        REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_REDCAP_DERIVED_DATE = 'REDCap Derived Date'
        REDCAP_VARIABLE_CHILD_MAP_MAP_TYPES = [REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_REDCAP_VARIABLE, REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_OMOP_CONCEPT, REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_REDCAP_DERIVED_DATE]

          def self.included(base)
          # Associations
          base.send :belongs_to, :parentable, polymorphic: true
          base.send :belongs_to, :omop_column, optional: true
          base.send :belongs_to, :concept, optional: true
          base.send :belongs_to, :redcap_variable, optional: true
          base.send :belongs_to, :redcap_derived_date, optional: true

          # Validations
          base.send :validates_presence_of, :map_type
          base.send :validates_presence_of, :omop_column_id
          base.send :validates_presence_of, :redcap_variable_id, if: -> { map_type == Redcap2omop::RedcapVariableChildMap::REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_REDCAP_VARIABLE }
          base.send :validates_presence_of, :concept_id, if: -> { map_type == Redcap2omop::RedcapVariableChildMap::REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_OMOP_CONCEPT }
          base.send :validates_presence_of, :redcap_derived_date_id, if: -> { map_type == Redcap2omop::RedcapVariableChildMap::REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_REDCAP_DERIVED_DATE }

          # Hooks
          base.send :before_save, :clean

          base.send :include, InstanceMethods
          base.extend(ClassMethods)
        end

        module InstanceMethods
          private
            def clean
              case map_type
              when Redcap2omop::RedcapVariableChildMap::REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_REDCAP_VARIABLE
                self.concept_id = nil
                self.redcap_derived_date_id = nil
              when Redcap2omop::RedcapVariableChildMap::REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_OMOP_CONCEPT
                self.redcap_variable_id = nil
                self.redcap_derived_date_id = nil
              when Redcap2omop::RedcapVariableChildMap::REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_REDCAP_DERIVED_DATE
                self.concept_id = nil
                self.redcap_variable_id = nil
              end
            end
        end

        module ClassMethods
        end
      end
    end
  end
end