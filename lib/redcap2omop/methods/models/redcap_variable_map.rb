module Redcap2omop
  module Methods
    module Models
      module RedcapVariableMap
        REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_COLUMN = 'OMOP column'
        REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_CONCEPT = 'OMOP concept'
        REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_CONCEPT_CHOICE = 'OMOP concept choice'
        REDCAP_VARIABLE_MAP_MAP_TYPES = [REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_COLUMN, REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_CONCEPT, REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_CONCEPT_CHOICE]

        def self.included(base)
          # Associations
          base.send :belongs_to, :redcap_variable
          base.send :belongs_to, :omop_column, optional: true
          base.send :belongs_to, :concept, optional: true

          # Validations
          base.send :validates_presence_of, :map_type
          base.send :validates_presence_of, :concept_id, if: -> { map_type == Redcap2omop::RedcapVariableMap::REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_CONCEPT }

          # Hooks
          base.send :before_save, :clean

          base.instance_eval do
            # Hooks
            # after_create_commit  { broadcast_prepend_to "redcap2omop_redcap_variable_maps" }
            # after_update_commit  { broadcast_replace_to "redcap2omop_redcap_variable_maps" }
            # after_destroy_commit { broadcast_remove_to "redcap2omop_redcap_variable_maps" }
          end

          base.send :include, InstanceMethods
          base.extend(ClassMethods)
        end

        module InstanceMethods
          private
            def clean
              case map_type
              when Redcap2omop::RedcapVariableMap::REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_COLUMN
                self.concept_id = nil
              when Redcap2omop::RedcapVariableMap::REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_CONCEPT
                self.omop_column_id = nil
              when Redcap2omop::RedcapVariableMap::REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_CONCEPT_CHOICE
                self.concept_id = nil
                self.omop_column_id = nil
              end
            end
        end

        module ClassMethods
          def by_omop_table(omop_table)
            joins(omop_column: :omop_table).where('redcap2omop_omop_tables.name = ?', omop_table)
          end

          def by_redcap_dictionary(redcap_data_dictionary)
            joins(:redcap_variable).where('redcap2omop_redcap_variables.redcap_data_dictionary_id = ?', redcap_data_dictionary.id)
          end
        end
      end
    end
  end
end