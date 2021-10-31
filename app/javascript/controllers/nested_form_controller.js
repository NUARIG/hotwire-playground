import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["add_item", "template", "list"]
  static values = { index: String }

  add_association(event) {
    var selects
    event.preventDefault()

    var content = this.templateTarget.innerHTML.replace(new RegExp(this.indexValue, 'g'), new Date().valueOf())
    this.listTarget.insertAdjacentHTML('beforeend', content)

    document.querySelectorAll('select.redcap2omop-select').forEach((select) => {
      $(select).select2()
    });
  }

  remove_association(event) {
    event.preventDefault()
    let item = event.target.closest(".nested-fields")
    item.querySelector("input[name*='_destroy']").value = 1
    item.style.display = 'none'
  }
}