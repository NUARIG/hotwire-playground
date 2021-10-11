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
  end

  def show
  end

  def update
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

    def sort_column
      ['name', 'api_token'].include?(params[:sort]) ? params[:sort] : 'name'
    end

    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] : 'asc'
    end
end