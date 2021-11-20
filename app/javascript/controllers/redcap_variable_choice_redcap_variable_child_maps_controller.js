import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "redcapVariableChildMap"]

  connect() {
    var omopColumnsurl, that
    omopColumnsurl = $('#omop_columns_url').attr('href')
    that = this

    $(this.redcapVariableChildMapTarget).find('.omop-column-select2').select2({
      ajax: {
        url: omopColumnsurl,
        dataType: 'json',
        delay: 250,
        data: function(params) {
          return {
            q: params.term,
            domain_id: that.redcapVariableChildMapTarget.closest('.redcap_variable_choice').querySelector('#redcap_variable_choice_map_concept_domain_id').value,
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
}