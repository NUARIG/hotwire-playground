module Redcap2omop
  module Methods
    module Models
      module RedcapVariableChoice
        REDCAP_VARIABLE_CHOICE_CURATION_STATUS_UNDETERMINED = 'undetermined'
        REDCAP_VARIABLE_CHOICE_CURATION_STATUS_UNDETERMINED_NEW_CHOICE = 'undetermined new choice'
        REDCAP_VARIABLE_CHOICE_CURATION_STATUS_UNDETERMINED_UPDATED_DESCRIPTION = 'undetermined updated description'
        REDCAP_VARIABLE_CHOICE_CURATION_STATUS_SKIPPED = 'skipped'
        REDCAP_VARIABLE_CHOICE_CURATION_STATUS_MAPPED = 'mapped'
        REDCAP_VARIABLE_CHOICE_CURATION_STATUSES = [REDCAP_VARIABLE_CHOICE_CURATION_STATUS_UNDETERMINED, REDCAP_VARIABLE_CHOICE_CURATION_STATUS_UNDETERMINED_NEW_CHOICE, REDCAP_VARIABLE_CHOICE_CURATION_STATUS_UNDETERMINED_UPDATED_DESCRIPTION, REDCAP_VARIABLE_CHOICE_CURATION_STATUS_SKIPPED, REDCAP_VARIABLE_CHOICE_CURATION_STATUS_MAPPED]

        def self.included(base)
          base.send :include, Redcap2omop::SoftDelete

          # Associations
          base.send :belongs_to, :redcap_variable
          base.send :has_one, :redcap_variable_choice_map, autosave: true
          base.send :has_many, :redcap_variable_child_maps, as: :parentable
          base.send :accepts_nested_attributes_for, :redcap_variable_child_maps, allow_destroy: true

          # Validations
          base.send :validates_presence_of, :concept_id, if: -> { curation_status == Redcap2omop::RedcapVariableChoice::REDCAP_VARIABLE_CHOICE_CURATION_STATUS_MAPPED }

          # Hooks
          base.send :after_initialize, :set_defaults

          base.send :attribute, :concept_id

          base.send :include, InstanceMethods
          base.extend(ClassMethods)
        end

        module InstanceMethods
          def redcap_variable_name
            if redcap_variable.checkbox?
              "#{redcap_variable.name}___#{self.choice_code_raw_normalized}"
            else
              redcap_variable.name
            end
          end

          def match?(value)
            if redcap_variable.checkbox?
              value == '1'
            else
              value == self.choice_code_raw
            end
          end

          def choice_code_raw_normalized
            normalized = self.choice_code_raw.downcase.gsub('-','_')
          end

          def concept_id
            if redcap_variable_choice_map
              redcap_variable_choice_map.concept_id
            end
          end

          def concept_id=(concept_id)
            if self.redcap_variable_choice_map.blank?
              self.build_redcap_variable_choice_map
            end
            attribute_will_change!(:concept_id)
            self.redcap_variable_choice_map.concept_id = concept_id
          end

          private
            def set_defaults
              if self.new_record?
                self.curation_status = Redcap2omop::RedcapVariableChoice::REDCAP_VARIABLE_CHOICE_CURATION_STATUS_UNDETERMINED
              end
            end
        end

        module ClassMethods
        end
      end
    end
  end
end
