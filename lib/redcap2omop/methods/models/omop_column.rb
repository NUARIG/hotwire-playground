module Redcap2omop
  module Methods
    module Models
      module OmopColumn
        def self.included(base)
          base.send :include, Redcap2omop::SoftDelete

          # Associations
          base.send :belongs_to, :omop_table

          base.send :include, InstanceMethods
          base.extend(ClassMethods)
        end

        module InstanceMethods
        end

        module ClassMethods
          def with_table
            joins(:omop_table).order('redcap2omop_omop_tables.name ASC, redcap2omop_omop_columns.name ASC')
          end

          def by_redcap_variable_child_map(redcap_variable_child_map)
            case redcap_variable_child_map.parentable_type
            when Redcap2omop::RedcapVariable.to_s
              if redcap_variable_child_map.parentable.redcap_variable_map.concept
                with_table.where('redcap2omop_omop_tables.name = ? AND redcap2omop_omop_columns.name != ?', redcap_variable_child_map.parentable.redcap_variable_map.concept.domain_table, "#{redcap_variable_child_map.parentable.redcap_variable_map.concept.domain_id.downcase}_concept_id")
              else
                with_table
              end
            when Redcap2omop::RedcapVariableChoice.to_s
              if redcap_variable_child_map.parentable.redcap_variable_choice_map.concept
                with_table.where('redcap2omop_omop_tables.name = ? AND redcap2omop_omop_columns.name != ?', redcap_variable_child_map.parentable.redcap_variable_choice_map.concept.domain_table, "#{redcap_variable_child_map.parentable.redcap_variable_choice_map.concept.domain_id.downcase}_concept_id")
              else
                with_table
              end
            end
          end
        end
      end
    end
  end
end