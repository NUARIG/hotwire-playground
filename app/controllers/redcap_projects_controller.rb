class RedcapProjectsController < ApplicationController
  before_action :load_redcap_project, only: [:edit, :show, :update]
  helper_method :sort_column, :sort_direction

  def index
    # authorize Project
    params[:page]||= 1
    options = {}
    options[:sort_column] = sort_column
    options[:sort_direction] = sort_direction
    @redcap_projects = Redcap2omop::RedcapProject.not_deleted.search_across_fields(params[:search], options).paginate(per_page: 10, page: params[:page])
  end

  def edit
  end

  def show
  end

  def update
    respond_to do |format|
      if @redcap_project.update(redcap_project_params)
        format.html { redirect_to @redcap_project, notice: 'REDCap project was successfully updated.' }
        format.json { render :show, status: :ok, location: @redcap_project }
      else
        format.html { render :edit }
        format.json { render json: @redcap_project.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    def load_redcap_project
      @redcap_project = Redcap2omop::RedcapProject.find(params[:id])
    end

    def redcap_project_params
      params.require(:redcap_project).permit(:name, :api_token, :route_to_observation, :insert_person, :complete_instrument, :api_import)
    end

    def sort_column
      ['name', 'api_token'].include?(params[:sort]) ? params[:sort] : 'name'
    end

    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] : 'asc'
    end
end