import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "redcapVariableChoice"]

  // https://stackoverflow.com/questions/60026651/safari-unexpected-token-expected-an-opening-before-a-methods-paramet/60026710
  // constructor() {
  //   this.targets = [ "redcapVariableChoiceForm"]
  // }

  connect() {
    var omopColumnsurl, domainId, that
    omopColumnsurl = $('#omop_columns_url').attr('href')
    that = this

    $(this.redcapVariableChoiceTarget).find('.redcap_variable_choice_redcap_variable_child_maps .omop-column-select2').select2({
      ajax: {
        url: omopColumnsurl,
        dataType: 'json',
        delay: 250,
        data: function(params) {
          return {
            q: params.term,
            domain_id: that.redcapVariableChoiceTarget.querySelector('#redcap_variable_choice_map_concept_domain_id').value,
            page: params.page
          }
        },
        processResults: function(data, params) {
          var results
          params.page = params.page || 1
          results = $.map(data.concepts, function(obj) {
            obj.id = obj.omop_column_id
            obj.text = obj.omop_column_name
            return obj
          })
          return {
            results: results,
            pagination: {
              more: params.page * 10 < data.total
            }
          }
        },
        cache: true
      },
      escapeMarkup: function(markup) {
        return markup
      },
      minimumInputLength: 4
    })
  }

  removeAssociationRedcapChildVariableMaps() {
    this.redcapVariableChoiceTarget.querySelectorAll('.redcap_variable_choice_redcap_variable_child_maps .redcap_variable_child_map').forEach((item) => {
      item.querySelector("input[name*='_destroy']").value = 1
      item.style.display = 'none'
    })
  }

  changeRedcpVariableChoiceMapConceptId(event) {
    var conceptSelect, redcapVariableChoiceMapConceptDomainId, newRedcapVariableChoiceMapConceptDomainId, controller
    controller = this

    conceptSelect = this.redcapVariableChoiceTarget.querySelector('.concept-select2')
    redcapVariableChoiceMapConceptDomainId = this.redcapVariableChoiceTarget.querySelector('#redcap_variable_choice_map_concept_domain_id').value
    newRedcapVariableChoiceMapConceptDomainId = conceptSelect.options[conceptSelect.selectedIndex].text.split(':')[0]

    if (redcapVariableChoiceMapConceptDomainId == newRedcapVariableChoiceMapConceptDomainId) {
    }
    else {
      this.redcapVariableChoiceTarget.querySelector('#redcap_variable_choice_map_concept_domain_id').value = newRedcapVariableChoiceMapConceptDomainId
      controller.removeAssociationRedcapChildVariableMaps()
    }
  }
}