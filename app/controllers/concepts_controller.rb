class ConceptsController < ApplicationController
  def index
    params[:page]||= 1
    params[:domains]||= []
    params[:concepts]||= []
    params[:concept_classes]||= []
    @all_concepts = Redcap2omop::Concept.search(params[:q], params[:domains], params[:concepts], params[:concept_classes])
    @concepts = @all_concepts.map { |concept| { concept_id: concept.concept_id, concept_name: "#{concept.domain_id}: #{concept.vocabulary_id}: #{concept.concept_name}"  } }
    @concepts = @concepts.paginate(per_page: 10, page: params[:page])
    respond_to do |format|
        format.json {
          render json: {
            concepts: @concepts,
            total: @all_concepts.count,
            links: { self: @concepts.current_page , next: @concepts.next_page }
        }.to_json
      }
    end
  end
end