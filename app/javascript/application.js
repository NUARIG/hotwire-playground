// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import { get } from "@rails/request.js"

document.addEventListener('turbo:load', (event) => {
  M.updateTextFields();

  var tabs = document.querySelectorAll('.tabs');
  M.Tabs.init(tabs, {});
})

document.addEventListener('turbo:frame-load', (event) => {
  M.updateTextFields();
})