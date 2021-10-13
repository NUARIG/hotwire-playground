Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'redcap_projects#index'

  resources :redcap_projects do
    resource :redcap_data_dictionary do
      resources :redcap_variables do
      end

      resources :redcap_person_variables do
      end

      resources :redcap_provider_variables do
      end

      resources :redcap_derived_dates do
      end
    end
  end

  resources :concepts do
  end
end