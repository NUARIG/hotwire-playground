class RedcapVariablesController < ApplicationController
  before_action :load_redcap_data_dictionary, only: [:index]
  before_action :load_redcap_variable, only: [:edit, :show, :update]
  helper_method :sort_column, :sort_direction

  def index
    # authorize Project
    params[:page]||= 1
    options = {}
    options[:sort_column] = sort_column
    options[:sort_direction] = sort_direction
    @redcap_variables = @redcap_data_dictionary.redcap_variables.not_deleted.search_across_fields(params[:search], options).paginate(per_page: 10, page: params[:page])
  end

  def edit
    if @redcap_variable.redcap_variable_map.blank?
      @redcap_variable.build_redcap_variable_map
    end
    @concepts = [@redcap_variable.redcap_variable_map.concept].compact
  end

  def show
  end

  def update
    if @redcap_variable.redcap_variable_map
      @concepts = [@redcap_variable.redcap_variable_map.concept].compact
    else
      @concepts = []
    end
    respond_to do |format|
      if @redcap_variable.update(redcap_variable_params)
        format.html { redirect_to redcap_project_redcap_data_dictionary_redcap_variable_url(@redcap_project, @redcap_variable), notice: 'REDCap variable was successfully updated.' }
        format.json { render :show, status: :ok, location: redcap_project_redcap_data_dictionary_redcap_variable_url(@redcap_project, @redcap_variable) }
      else
        format.html { render :edit }
        format.json { render json: @redcap_variable.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    def load_redcap_data_dictionary
      @redcap_project = Redcap2omop::RedcapProject.find(params[:redcap_project_id])
      @redcap_data_dictionary = @redcap_project.current_redcap_data_dictionary
    end

    def load_redcap_variable
      @redcap_project = Redcap2omop::RedcapProject.find(params[:redcap_project_id])
      @redcap_variable = Redcap2omop::RedcapVariable.find(params[:id])
    end

    def redcap_variable_params
      params.require(:redcap_variable).permit(:curation_status)
    end

    def redcap_variable_params
      if params[:redcap_variable][:curation_status] == Redcap2omop::RedcapVariable::REDCAP_VARIABLE_CURATION_STATUS_SKIPPED && params[:redcap_variable][:redcap_variable_map_attributes][:id].blank?
        params[:redcap_variable].delete(:redcap_variable_map_attributes)
      end

      params.require(:redcap_variable).permit(:curation_status, redcap_variable_map_attributes: [:id, :map_type, :concept_id, :omop_column_id, :_destroy], redcap_variable_choices_attributes: [:id, :curation_status, :concept_id,  redcap_variable_child_maps_attributes: [:id, :map_type, :omop_column_id, :redcap_variable_id, :concept_id, :redcap_derived_date_id, :_destroy]], redcap_variable_child_maps_attributes: [:id, :map_type, :omop_column_id, :redcap_variable_id, :concept_id, :redcap_derived_date_id, :_destroy])
    end

    def sort_column
      ['name', 'form_name'].include?(params[:sort]) ? params[:sort] : 'name'
    end

    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] : 'asc'
    end
end