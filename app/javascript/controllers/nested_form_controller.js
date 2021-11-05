import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["add_item", "template", "list"]
  static values = { index: String }

  add_association(event) {
    var selects, conceptsUrl
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
  }

  remove_association(event) {
    event.preventDefault()
    let item = event.target.closest(".nested-fields")
    item.querySelector("input[name*='_destroy']").value = 1
    item.style.display = 'none'
  }
}