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
        end
      end
    end
  end
end