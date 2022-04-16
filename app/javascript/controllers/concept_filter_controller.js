import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['omopConceptFilter']

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
    var controller, conceptSelect2
    controller = this

    conceptSelect2 = controller.omopConceptFilterTarget.closest('.omop_concept_id').querySelector('.concept-select2')
    conceptSelect2 =  $(conceptSelect2).data('select2').dropdown.$search
    conceptSelect2.trigger('input');
  }
}