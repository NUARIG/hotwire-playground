import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = []

  connect() {
  }

  changeConceptFilterOmopDomain(event) {
    var controller
    controller = this
    controller.refreshConceptSelect2()
  }

  changeConceptFilterOmopStandardConcept(event) {
    var controller
    controller = this
    controller.refreshConceptSelect2()
  }

  changeConceptFilterOmopConceptClass(event) {
    var controller
    controller = this
    controller.refreshConceptSelect2()
  }

  refreshConceptSelect2 () {
    var conceptSelect2
    conceptSelect2 =  $('.concept-select2').data('select2').dropdown.$search
    conceptSelect2.trigger('input');
  }
}