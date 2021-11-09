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

  def hide_redcap_variable_map_concept_id(redcap_variable)
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

  def hide_redcap_variable_child_maps(redcap_variable)
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

  def hide_redcap_variable_chocie_redcap_variable_child_maps(redcap_variable)
    if redcap_variable.redcap_variable_map
      if redcap_variable.redcap_variable_map.map_type == Redcap2omop::RedcapVariableMap::REDCAP_VARIABLE_MAP_MAP_TYPE_OMOP_CONCEPT
        'hide'
      else
        ''
      end
    else
      'hide'
    end
  end

  def hide_redcap_variable_child_map_concept_id(redcap_variable_child_map)
    if redcap_variable_child_map.map_type == Redcap2omop::RedcapVariableChildMap::REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_OMOP_CONCEPT
      ''
    else
      'hide'
    end
  end

  def hide_redcap_variable_child_map_redcap_variable_id(redcap_variable_child_map)
    if redcap_variable_child_map.map_type == Redcap2omop::RedcapVariableChildMap::REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_REDCAP_VARIABLE
      ''
    else
      'hide'
    end
  end

  def hide_redcap_variable_child_map_redcap_derived_date_id(redcap_variable_child_map)
    if redcap_variable_child_map.map_type == Redcap2omop::RedcapVariableChildMap::REDCAP_VARIABLE_CHILD_MAP_MAP_TYPE_REDCAP_DERIVED_DATE
      ''
    else
      'hide'
    end
  end

  def hide_redcap_variable_choice_map_concept_id(redcap_variable_choice)
    if redcap_variable_choice.curation_status == Redcap2omop::RedcapVariableChoice::REDCAP_VARIABLE_CHOICE_CURATION_STATUS_MAPPED
      ''
    else
      'hide'
    end
  end
end