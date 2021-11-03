import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "redcapVariableForm"]
  connect() {
    var conceptsUrl, selects, redcapVariableForm
    conceptsUrl = $('#concepts_url').attr('href')

    $(this.redcapVariableFormTarget).find('.concept-select2').select2({
      ajax: {
        url: conceptsUrl,
        dataType: 'json',
        delay: 250,
        data: function(params) {
          return {
            q: params.term,
            page: params.page
          };
        },
        processResults: function(data, params) {
          var results;
          params.page = params.page || 1;
          results = $.map(data.concepts, function(obj) {
            obj.id = obj.concept_id;
            obj.text = obj.concept_name;
            return obj;
          });
          return {
            results: results,
            pagination: {
              more: params.page * 10 < data.total
            }
          };
        },
        cache: true
      },
      escapeMarkup: function(markup) {
        return markup;
      },
      minimumInputLength: 4
    });

    document.querySelectorAll('select.redcap2omop-select').forEach((select) => {
      $(select).select2()
    });
  }

  changeCurationStatus (event) {
    var controller, redcapVariableForm, redcapVariableMapForm, destroyRedcapVariableMap, idRedcapVariableMap, redcapVariableChoices
    controller = this

    redcapVariableForm = event.target.closest('.redcap_variable_form')
    redcapVariableMapForm = redcapVariableForm.querySelector('.redcap_variable_map_form')
    destroyRedcapVariableMap = redcapVariableForm.querySelector('#redcap_variable_redcap_variable_map_attributes__destroy')
    idRedcapVariableMap = redcapVariableForm.querySelector('#redcap_variable_redcap_variable_map_attributes_id')
    redcapVariableChoices = redcapVariableForm.querySelector('.redcap_variable_choices')

    switch(event.target.value) {
      case 'skipped':
        redcapVariableMapForm.classList.toggle('hide')
        redcapVariableChoices.classList.add('hide')
        if(idRedcapVariableMap != null) {
          destroyRedcapVariableMap.value = 1
        }
        break;
      case 'mapped':
        redcapVariableMapForm.classList.toggle('hide')
        redcapVariableChoices.classList.remove('hide')
        destroyRedcapVariableMap.value = null
        break;
    }
  }

  changeMapType (event) {
    var controller, redcapVariableConceptId
    controller = this

    redcapVariableConceptId = event.target.closest('.redcap_variable_form').querySelector('.concept_id')

    switch(event.target.value) {
      case 'OMOP column':
        redcapVariableConceptId.classList.add('hide')
        break;
      case 'OMOP concept':
        redcapVariableConceptId.classList.remove('hide')
        break;
      case 'OMOP concept choice':
        redcapVariableConceptId.classList.add('hide')
        break;
    }
  }

  changeRedcapVariableChoiceCurationStatus (event) {
    var controller, redcapVariableChoiceConceptId, redcapVariableChoiceConceptIdSelect
    controller = this

    redcapVariableChoiceConceptId = event.target.closest('.redcap_variable_choice').querySelector('.redcap_variable_choice_concept_id')
    redcapVariableChoiceConceptIdSelect = event.target.closest('.redcap_variable_choice').querySelector('.redcap_variable_choice_concept_id select')

    switch(event.target.value) {
      case 'skipped':
        redcapVariableChoiceConceptId.classList.add('hide')
        redcapVariableChoiceConceptIdSelect.value = ''
        break
      case 'mapped':
        redcapVariableChoiceConceptId.classList.remove('hide')
        break
    }
  }

  changeRedcapVariableChildMapType (event) {
    var controller, redcapVariableChildMapRedcapVariableId, redcapVariableChildMapConceptId, redcapVariableChildMapRedcapDerivedDateId
    controller = this

    redcapVariableChildMapRedcapVariableId = event.target.closest('.redcap_variable_child_map').querySelector('.concept_id input')
    redcapVariableChildMapConceptId = event.target.closest('.redcap_variable_child_map').querySelector('.concept_id input')
    redcapVariableChildMapRedcapDerivedDateId = event.target.closest('.redcap_variable_child_map').querySelector('.concept_id input')

    switch(event.target.value) {
      case 'OMOP column':
        redcapVariableChildMapConceptId.classList.add('hide')
        break;
      case 'OMOP concept':
        redcapVariableConceptId.classList.remove('hide')
        break;
      case 'OMOP concept choice':
        redcapVariableConceptId.classList.add('hide')
        break;
    }
  }
}
