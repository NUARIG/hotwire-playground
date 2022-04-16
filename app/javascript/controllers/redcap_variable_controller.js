import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = [ 'redcapVariableForm', 'omopConceptFilter']

  // https://stackoverflow.com/questions/60026651/safari-unexpected-token-expected-an-opening-before-a-methods-paramet/60026710
  // constructor() {
  //   this.targets = [ "redcapVariableForm"]
  // }

  connect() {
    var controller, conceptsUrl, omopColumnsurl, selects
    conceptsUrl = $('#concepts_url').attr('href')
    omopColumnsurl = $('#omop_columns_url').attr('href')
    controller = this

    this.redcapVariableFormTarget.querySelectorAll('.concept_id, .redcap_variable_choice_concept_id').forEach((concept_id) => {
      var select2
      select2 = concept_id.querySelector('.concept-select2')
      $(select2).select2({
        ajax: {
          url: conceptsUrl,
          dataType: 'json',
          delay: 250,
          data: function(params) {
            var domains, concepts, conceptClasses
            domains = Array.from(document.querySelectorAll('.select2-results .omop-domain:checked')).map(function(domain) {
              return domain.value
            })

            concepts = Array.from(document.querySelectorAll('.select2-results .omop-standard-concept:checked')).map(function(domain) {
              return domain.value
            })

            conceptClasses = Array.from(document.querySelectorAll('.select2-results .omop-concept-class:checked')).map(function(conceptClass) {
              return conceptClass.value
            })

            return {
              q: params.term,
              domains: domains,
              concepts: concepts,
              concept_classes: conceptClasses,
              page: params.page
            }
          },
          processResults: function(data, params) {
            var results
            params.page = params.page || 1
            results = $.map(data.concepts, function(obj) {
              obj.id = obj.concept_id
              obj.text = obj.concept_name
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
        minimumInputLength: 4,
        dropdownParent: $(concept_id)
      })
    })

    $(this.redcapVariableFormTarget).find('.redcap_variable_child_maps .omop-column-select2').select2({
      ajax: {
        url: omopColumnsurl,
        dataType: 'json',
        delay: 250,
        data: function(params) {
          return {
            q: params.term,
            domain_id: controller.redcapVariableFormTarget.querySelector('#redcap_variable_map_concept_domain_id').value,
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

    $('.concept-select2').on('select2:select', function () {
      let event = new Event('change', { bubbles: true }) // fire a native event
      this.dispatchEvent(event)
    })

    $('.concept-select2').on('select2:open', function (e) {
      var select2Results, content, elems, instances, omopConceptFilter
      select2Results = document.querySelector('.select2-results')
      omopConceptFilter = select2Results.querySelector('.omop-concept-filter')
      if (omopConceptFilter) {
        select2Results.removeChild(omopConceptFilter)
      }

      content = controller.omopConceptFilterTarget.innerHTML
      select2Results.insertAdjacentHTML('beforeend', content)

      elems = select2Results.querySelectorAll('.collapsible');
      instances = M.Collapsible.init(elems, {})
    })

    this.redcapVariableFormTarget.querySelectorAll('select.redcap2omop-select').forEach((select) => {
      $(select).select2()
    })
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
        break
      case 'mapped':
        redcapVariableMapForm.classList.toggle('hide')
        redcapVariableChoices.classList.remove('hide')
        destroyRedcapVariableMap.value = null
        break
    }
  }

  changeMapType (event) {
    var controller, redcapVariableConceptId, redcap_variable_child_maps
    controller = this

    redcapVariableConceptId = event.target.closest('.redcap_variable_form').querySelector('.concept_id')
    redcap_variable_child_maps = document.querySelector('.redcap_variable_child_maps')
    switch(event.target.value) {
      case 'OMOP column':
        redcapVariableConceptId.classList.add('hide')
        break
      case 'OMOP concept':
        redcapVariableConceptId.classList.remove('hide')
        redcap_variable_child_maps.classList.remove('hide')
        controller.removeAssociationRedcapChildVariableMaps()
        controller.toggleHideRedcapVariableChoiceRedcapChildVariableMaps()
        break
      case 'OMOP concept choice':
        redcapVariableConceptId.classList.add('hide')
        redcap_variable_child_maps.classList.add('hide')
        controller.removeAssociationRedcapChildVariableMaps()
        controller.toggleHideRedcapVariableChoiceRedcapChildVariableMaps()
        break
    }
  }

  removeAssociationRedcapChildVariableMaps() {
    document.querySelectorAll('.redcap_variable_child_maps .redcap_variable_child_map').forEach((item) => {
      item.querySelector("input[name*='_destroy']").value = 1
      item.style.display = 'none'
    })
  }

  removeAssociationRedcapVariableChoiceRedcapChildVariableMaps() {
    document.querySelectorAll('.redcap_variable_choice_redcap_variable_child_maps .redcap_variable_child_map').forEach((item) => {
      item.querySelector("input[name*='_destroy']").value = 1
      item.style.display = 'none'
    })
  }

  toggleHideRedcapVariableChoiceRedcapChildVariableMaps() {
    document.querySelectorAll('.redcap_variable_choice_redcap_variable_child_maps').forEach((item) => {
      item.classList.toggle('hide')
    })
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
        break
      case 'OMOP Concept':
        redcapVariableChildMapRedcapVariableId.classList.add('hide')
        redcapVariableChildMapConceptId.classList.remove('hide')
        redcapVariableChildMapRedcapDerivedDateId.classList.add('hide')
        break
      case 'REDCap Derived Date':
        redcapVariableChildMapRedcapVariableId.classList.add('hide')
        redcapVariableChildMapConceptId.classList.add('hide')
        redcapVariableChildMapRedcapDerivedDateId.classList.remove('hide')
        break
    }
  }

  changeRedcpVariableMapConceptId(event) {
    var conceptSelect, redcapVariableMapConceptDomainId, newRedcapVariableMapConceptDomainId, controller
    controller = this

    conceptSelect = this.redcapVariableFormTarget.querySelector('.concept-select2')
    redcapVariableMapConceptDomainId = this.redcapVariableFormTarget.querySelector('#redcap_variable_map_concept_domain_id').value
    newRedcapVariableMapConceptDomainId = conceptSelect.options[conceptSelect.selectedIndex].text.split(':')[0]

    if (redcapVariableMapConceptDomainId == newRedcapVariableMapConceptDomainId) {
    }
    else {
      this.redcapVariableFormTarget.querySelector('#redcap_variable_map_concept_domain_id').value = newRedcapVariableMapConceptDomainId
      controller.removeAssociationRedcapChildVariableMaps()
    }
  }
}