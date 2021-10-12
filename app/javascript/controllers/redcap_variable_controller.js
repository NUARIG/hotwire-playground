import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
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