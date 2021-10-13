import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    var conceptsUrl
    conceptsUrl = $('#concepts_url').attr('href');
    $('.concept-select2').select2({
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
      minimumInputLength: 2
    });

  }

  changeCurationStatus (event) {
    var controller, redcapVariableForm, redcapVariableMapForm, destroyRedcapVariableMap, idRedcapVariableMap;
    controller = this

    redcapVariableForm = event.target.closest('.redcap_variable_form')
    redcapVariableMapForm = redcapVariableForm.querySelector('.redcap_variable_map_form')
    destroyRedcapVariableMap = redcapVariableForm.querySelector('#redcap_variable_redcap_variable_map_attributes__destroy')
    idRedcapVariableMap = redcapVariableForm.querySelector('#redcap_variable_redcap_variable_map_attributes_id')

    switch(event.target.value) {
      case 'skipped':
        redcapVariableMapForm.classList.toggle('hide')
        if(idRedcapVariableMap != null) {
          destroyRedcapVariableMap.value = 1
        }
        break;
      case 'mapped':
        redcapVariableMapForm.classList.toggle('hide')
        destroyRedcapVariableMap.value = null
        break;
    }
  }
}