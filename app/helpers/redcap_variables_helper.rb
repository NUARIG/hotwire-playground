module RedcapVariablesHelper
  def hide_redcap_variable_map(redcap_variable)
    if redcap_variable.curation_status == Redcap2omop::RedcapVariable::REDCAP_VARIABLE_CURATION_STATUS_SKIPPED
      'hide'
    else
      ''
    end
  end

  def hide_redcap_variable_choices(redcap_variable)
    if redcap_variable.curation_status == Redcap2omop::RedcapVariable::REDCAP_VARIABLE_CURATION_STATUS_SKIPPED
      'hide'
    else
      ''
    end
  end

  def hide_hide_redcap_variable_map_concept_id(redcap_variable)
    if redcap_variable.redcap_variable_map
      if redcap_variable.redcap_variable_map.map_type == Redcap2omop::RedcapVariableMap::REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_CONCEPT
        ''
      else
        'hide'
      end
    else
      'hide'
    end
  end
end