module RedcapVariablesHelper
  def hide_redcap_variable_map(curation_status)
    if curation_status == Redcap2omop::RedcapVariable::REDCAP_VARIABLE_CURATION_STATUS_SKIPPED
      'hide'
    else
      ''
    end
  end
end
