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

    this.redcapVariableFormTarget.querySelectorAll('select.redcap2omop-select').forEach((select) => {
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
    var controller, redcapVariableConceptId, redcap_variable_child_maps
    controller = this


    redcapVariableConceptId = event.target.closest('.redcap_variable_form').querySelector('.concept_id')
    redcap_variable_child_maps = document.querySelector('.redcap_variable_child_maps');
    switch(event.target.value) {
      case 'OMOP column':
        redcapVariableConceptId.classList.add('hide')
        break;
      case 'OMOP concept':
        redcapVariableConceptId.classList.remove('hide')
        redcap_variable_child_maps.classList.remove('hide')
        break;
      case 'OMOP concept choice':
        redcapVariableConceptId.classList.add('hide')
        redcap_variable_child_maps.classList.add('hide')
        controller.remove_association_redcap_child_variable_maps()
        break;
    }
  }

  remove_association_redcap_child_variable_maps() {
    document.querySelectorAll('.redcap_variable_child_maps .redcap_variable_child_map').forEach((item) => {
      item.querySelector("input[name*='_destroy']").value = 1
      item.style.display = 'none'
    });
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

    redcapVariableChildMapRedcapVariableId = event.target.closest('.redcap_variable_child_map').querySelector('.redcap_variable_child_map_redcap_variable_id .input')
    redcapVariableChildMapConceptId = event.target.closest('.redcap_variable_child_map').querySelector('.redcap_variable_child_map_redcap_concept_id .input')
    redcapVariableChildMapRedcapDerivedDateId = event.target.closest('.redcap_variable_child_map').querySelector('.redcap_variable_child_map_redcap_derived_date_id .input')

    switch(event.target.value) {
      case 'REDCap Variable':
        redcapVariableChildMapRedcapVariableId.classList.remove('hide')
        redcapVariableChildMapConceptId.classList.add('hide')
        redcapVariableChildMapRedcapDerivedDateId.classList.add('hide')
        break;
      case 'OMOP Concept':
        redcapVariableChildMapRedcapVariableId.classList.add('hide')
        redcapVariableChildMapConceptId.classList.remove('hide')
        redcapVariableChildMapRedcapDerivedDateId.classList.add('hide')
        break;
      case 'REDCap Derived Date':
        redcapVariableChildMapRedcapVariableId.classList.add('hide')
        redcapVariableChildMapConceptId.classList.add('hide')
        redcapVariableChildMapRedcapDerivedDateId.classList.remove('hide')
        break;
    }
  }
}
