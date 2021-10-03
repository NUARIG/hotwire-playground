# README

CREATE DATABASE hotwire_playground_development;
CREATE USER hotwire_playground_development WITH CREATEDB PASSWORD 'hotwire_playground_development';
ALTER DATABASE hotwire_playground_development OWNER TO hotwire_playground_development;
ALTER USER hotwire_playground_development SUPERUSER;

rails new hotwire-playground --skip-javascript

#new world
# gem 'cssbundling-rails'
# gem 'jsbundling-rails'
gem 'importmap-rails'
gem 'stimulus-rails'
gem 'turbo-rails'

./bin/rails importmap:install
./bin/rails turbo:install
./bin/rails turbo:install:redis
./bin/rails stimulus:install

pg_dump redcap2omop_development -h localhost -U redcap2omop_development > redcap2omop_development.sql
redcap2omop_development
psql -U hotwire_playground_development  -d hotwire_playground_development -h localhost -f redcap2omop_development.sql