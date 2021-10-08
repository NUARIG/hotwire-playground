class RedcapDataDictionariesController < ApplicationController
  before_action :load_redcap_project, only: [:edit, :update]
  helper_method :sort_column, :sort_direction

  def edit
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
      @redcap_project = Redcap2omop::RedcapProject.find(params[:redcap_project_id])
      @redcap_data_dictionary = @redcap_project.current_redcap_data_dictionary
      @redcap_variables = @redcap_data_dictionary.redcap_variables.not_deleted.paginate(per_page: 10, page: params[:page])
    end

    def redcap_project_params
      params.require(:redcap_project).permit(:name, :api_token, :route_to_observation, :insert_person, :complete_instrument, :api_import)
    end

    def sort_column
      [''].include?(params[:sort]) ? params[:sort] : ''
    end

    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] : 'asc'
    end
end