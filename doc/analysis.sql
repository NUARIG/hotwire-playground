select  rv.name
      , rv.field_type
      , rv.field_type_normalized
      , rv.text_validation_type
      , rvm.map_type
      , rvm.concept_id
      , c1.domain_id
      , rvc.choice_code_raw
      , rvc.choice_description
      , 'moomin'
      , rvcm.*
from redcap2omop_redcap_variables rv join redcap2omop_redcap_variable_maps rvm on rv.id = rvm.redcap_variable_id
                                     left join concept c1 on rvm.concept_id = c1.concept_id
                                     left join redcap2omop_redcap_variable_choices rvc on rv.id = rvc.redcap_variable_id
                                     left join redcap2omop_redcap_variable_choice_maps rvcm on rvc.id = rvcm.redcap_variable_choice_id
where rv.redcap_data_dictionary_id = 44
and rvm.map_type = 'OMOP concept'
and rv.field_type_normalized = 'choice'
and c1.domain_id in('Measurement', 'Observation')
order by rvm.map_type, rv.field_type, rv.text_validation_type, c1.domain_id