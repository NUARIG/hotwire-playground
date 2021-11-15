class OmopColumnsController < ApplicationController
  def index
    params[:page]||= 1

    if params[:domain_id]
      @all_omop_columns = Redcap2omop::OmopColumn.by_domain_id(params[:domain_id]).search(params[:q])
    else
      @all_omop_columns = Redcap2omop::OmopColumn.search(params[:q])
    end

    @omop_columns = @all_omop_columns.map { |omop_column| { omop_column_id: omop_column.id, omop_column_name: omop_column.full_name } }
    @omop_columns = @omop_columns.paginate(per_page: 10, page: params[:page])
    respond_to do |format|
        format.json {
          render json: {
            concepts: @omop_columns,
            total: @all_omop_columns.count,
            links: { self: @omop_columns.current_page , next: @omop_columns.next_page }
        }.to_json
      }
    end
  end
end