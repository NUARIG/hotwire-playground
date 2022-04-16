import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["add_item", "template", "list"]
  static values = { index: String }

  // https://stackoverflow.com/questions/60026651/safari-unexpected-token-expected-an-opening-before-a-methods-paramet/60026710
  // constructor() {
  //   this.targets = ["add_item", "template", "list"]
  //   this.values =  { index: String }
  // }

  add_association(event) {
    var selects, conceptsUrl, controller
    controller = this
    event.preventDefault()

    var content = this.templateTarget.innerHTML.replace(new RegExp(this.indexValue, 'g'), new Date().valueOf())
    this.listTarget.insertAdjacentHTML('beforeend', content)

    this.listTarget.querySelectorAll('select.redcap2omop-select').forEach((select) => {
      $(select).select2()
    });

    conceptsUrl = $('#concepts_url').attr('href')
    $(this.listTarget).find('.concept-select2').select2({
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
      minimumInputLength: 4,
      dropdownParent: $(this.listTarget).find('.omop_concept_id')
    });

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

      content = document.querySelector('#omopConceptFilter').innerHTML
      select2Results.insertAdjacentHTML('beforeend', content)

      elems = select2Results.querySelectorAll('.collapsible');
      instances = M.Collapsible.init(elems, {})
    })
  }

  remove_association(event) {
    event.preventDefault()
    let item = event.target.closest(".nested-fields")
    item.querySelector("input[name*='_destroy']").value = 1
    item.style.display = 'none'
  }
}