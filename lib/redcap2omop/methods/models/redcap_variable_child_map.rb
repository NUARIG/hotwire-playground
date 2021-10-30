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
          # base.send :validates_presence_of, :concept_id, if: -> { map_type == Redcap2omop::RedcapVariableMap::REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_CONCEPT }

          base.send :include, InstanceMethods
          base.extend(ClassMethods)
        end

        module InstanceMethods
        end

        module ClassMethods
        end
      end
    end
  end
end